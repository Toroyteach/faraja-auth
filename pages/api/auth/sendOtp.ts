import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../utils/prisma";
import { createOtp } from "../../../utils/otp";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    const otp = await createOtp(phone);

    res.status(200).json({ message: `OTP ${otp} sent to phone ${phone}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
};