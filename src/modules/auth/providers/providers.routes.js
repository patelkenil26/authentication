import { Router } from "express";
import { providerRedirect, providerCallback } from "./providers.controller.js";

const router = Router();

// Yahan hum hardcode nahi kar rahe, ':provider' variable use kar rahe hain
router.get("/:provider", providerRedirect);
router.get("/:provider/callback", providerCallback);

export default router;
