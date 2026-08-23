import crypto from "crypto";
import bcrypt from "bcryptjs"
import ApiError from "../../common/utils/api-error.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  generateResetToken,
} from "../../common/utils/jwt.utils.js";
import {
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../../common/config/email.js";
import { eq, and, gt } from "drizzle-orm";
import { db } from "../../common/config/db.js";
import { userTable } from "./auth.schema.js";

// Hash refresh token before storing — same approach as reset tokens
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password, role }) => {
  // const existing = await User.findOne({ email });
  const [existingUser] = await db.select().from(userTable).where(eq(userTable.email, email))
  if (existingUser) throw ApiError.conflict("Email already registered");

  const { rawToken, hashedToken } = generateResetToken();

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 12)
  }

  const [user] = await db.insert(userTable).values({
    name,
    email,
    password: hashedPassword,
    role,
    verificationToken: hashedToken,
  }).returning();

  // Don't let email failure crash registration — user is already created
  try {
    await sendVerificationEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send verification email:", err.message);
  }

  const userObj = { ...user };
  delete userObj.password;
  delete userObj.verificationToken;

  return userObj;
};

const login = async ({ email, password }) => {
  // const user = await User.findOne({ email }).select("+password");
  const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  //OIDC||SSO
  if (!user.password) {
    throw ApiError.unauthorized("Please login using your social account google/github")
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid email or password");

  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  // Store hashed refresh token in DB so it can be invalidated on logout
  await db.update(userTable).set({ refreshToken: hashToken(refreshToken) }).where(eq(userTable.id, user.id))

  const userObj = { ...user };
  delete userObj.password;
  delete userObj.refreshToken;

  return { user: userObj, accessToken, refreshToken };
};

// Issues a new access token using a valid refresh token
const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const [user] = await db.select().from(userTable).where(eq(userTable.id, decoded.id));
  if (!user) throw ApiError.unauthorized("User no longer exists");

  // Verify the refresh token matches what's stored (prevents reuse of old tokens)
  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token — please log in again");
  }

  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  return { accessToken };
};

const logout = async (userId) => {
  // Clear stored refresh token so it can't be reused
  await db
    .update(userTable)
    .set({ refreshToken: null })
    .where(eq(userTable.id, userId));
};

const verifyEmail = async (token) => {
  const trimmed = String(token).trim();
  if (!trimmed) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }

  // DB stores SHA256(raw). Links / email use the raw token — we hash for lookup.
  // If you paste the hash from MongoDB into Postman, hashing again would not match;
  // so we also try a direct match on the stored value.
  const hashedInput = hashToken(trimmed);
  const [user] = await db.select().from(userTable).where(eq(userTable.verificationToken, hashedInput));
   // fallback for developer testing purpose only code
  // if (!user) {
  //   user = await User.findOne({ verificationToken: trimmed }).select(
  //     "+verificationToken",
  //   );
  // }
  if (!user) throw ApiError.badRequest("Invalid or expired verification token");

  await db
    .update(userTable)
    .set({ isVerified: true, verificationToken: null })
    .where(eq(userTable.id, user.id));

  return user;
};

const forgotPassword = async (email) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
  if (!user) throw ApiError.notFound("No account with that email");

  const { rawToken, hashedToken } = generateResetToken();
  const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 mins from now

  await db
    .update(userTable)
    .set({ resetPasswordToken: hashedToken, resetPasswordExpires: expiryDate })
    .where(eq(userTable.id, user.id));

  try {
    await sendResetPasswordEmail(email, rawToken);
  } catch (err) {
    console.error("Failed to send reset email:", err.message);
  }
};

const resetPassword = async (token, newPassword) => {
  const hashedToken = hashToken(token);

  const [user] = await db
    .select()
    .from(userTable)
    .where(
      and(
        eq(userTable.resetPasswordToken, hashedToken),
        gt(userTable.resetPasswordExpires, new Date())
      )
    );

  if (!user) throw ApiError.badRequest("Invalid or expired reset token");

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await db
    .update(userTable)
    .set({ password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null })
    .where(eq(userTable.id, user.id));
};

const getMe = async (userId) => {
  const [user] = await db.select().from(userTable).where(eq(userTable.id, userId));
  if (!user) throw ApiError.notFound("User not found");
  
  const userObj = { ...user };
  delete userObj.password;
  delete userObj.refreshToken;
  delete userObj.verificationToken;
  delete userObj.resetPasswordToken;
  delete userObj.resetPasswordExpires;

  return userObj;
};

export {
  register,
  login,
  refresh,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
};
