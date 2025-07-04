import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateAccessJWT } from "../utils/generateAccessJWT";

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ where: { email } });

  if (!existingUser) {
    res
      .status(400)
      .json({
        message: "No existe ningun usuario con ese correo electrónico",
        success: false,
      });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );

  if (!isPasswordValid) {
    res
      .status(401)
      .json({ message: "La contraseña es incorrecta", success: false });
    return;
  }
  const { password, ...userWithoutPassword } = existingUser.get({
    plain: true,
  });

  let options = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
  };
  const token = generateAccessJWT({ id: existingUser.id });
  res.cookie("access_token", token, options);

  res.status(200).json({
    message: "Usuario loegueado con éxito",
    token,
    data: userWithoutPassword,
    success: true,
  });
};

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
  res
    .status(200)
    .json({ message: "Sesión cerrada correctamente", success: true });
};
