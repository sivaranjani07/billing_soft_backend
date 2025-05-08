import jwt from "jsonwebtoken";

export const generateToken = (userId: number) => {
  return jwt.sign({ userId }, 'Billing_secret' as string, {
    expiresIn: "1h"
  });
};
