import CommunicationLog from "@/models/communicationLogModel";

export async function createCommunicationLog({
  receiverName,
  receiverEmail,
  receiverNumber,
  receiverType,
  channel,
  messageType,
}: {
  receiverName: string;
  receiverEmail?: string;
  receiverNumber?: string;
  receiverType: "student" | "parent" | "teacher" | "inquiry";
  channel: "email" | "whatsapp";
    messageType: "fee-reminder" | "class-reminder" | "onboarding-reminder" | "inquiry-fill" | "student-created" | "teacher-created" | "forgot-password" | "career-request";
}) {
  try {
    await CommunicationLog.create({
      receiverName,
      receiverEmail,
      receiverNumber,
      receiverType,
      channel,
      messageType,
    });
    console.log(`📩 Log created for ${channel} (${receiverName})`);
  } catch (err) {
    console.warn("⚠️ Failed to create communication log:", err);
  }
}
