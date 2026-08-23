import { readFileSync } from "fs"
import path from "path"

const certPath = path.join(process.cwd(), "cert")

export const PRIVATE_KEY = readFileSync(path.join(certPath, "private-key.pem"), "utf-8").toString()
export const PUBLIC_KEY = readFileSync(path.join(certPath, "public-key.pub"), "utf-8").toString()
