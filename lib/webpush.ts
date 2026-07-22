import webpush from "web-push"

const publicKey = process.env.VAPID_PUBLIC_KEY || ""
const privateKey = process.env.VAPID_PRIVATE_KEY || ""
const subject = process.env.VAPID_SUBJECT || "mailto:admin@sehatki.id"

let configured = false
if (publicKey && privateKey) {
  try {
    webpush.setVapidDetails(subject, publicKey, privateKey)
    configured = true
  } catch (e) {
    console.error("VAPID setup error:", e)
  }
}

export const isPushConfigured = () => configured
export { webpush }
