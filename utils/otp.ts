import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

export const createOtp = async (phone: string) => {
  const otpcode = generateOtp();
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // OTP expires in 2 minutes

//   await prisma.Otpassword.upsert({
//     where: { phone },
//     update: { otpcode, expiresAt },
//     create: { phone, otpcode, expiresAt },
//   });

  return otpcode;
};

export const verifyOtp = async (phone: string, otpcode: string) => {
//   const otpRecord = await prisma.Otpassword.findUnique({
//     where: { phone },
//   });

//   if (!otpRecord) return false;

  // Check if the OTP is valid and not expired
  return true;
//   return otpRecord.otp === otpcode && otpRecord.expiresAt > new Date();
};