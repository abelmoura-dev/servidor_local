import { Request, Response } from "express";
import AppError from "../errors/AppError";
import { getIO } from "../libs/socket";
import AuthUserService from "../services/UserServices/AuthUserService";
import { SendRefreshToken } from "../helpers/SendRefreshToken";
import { RefreshTokenService } from "../services/AuthServices/RefreshTokenService";
import FindUserFromToken from "../services/AuthServices/FindUserFromToken";
import User from "../models/User";
import fetch from 'node-fetch';

interface HCaptchaResponse {
  success: boolean;
  // outras propriedades, se houver
}

const verifyHCaptcha = async (hCaptchaToken): Promise<void> => {
  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.HCAPTCHA_SECRET}&response=${hCaptchaToken}`,
    });

    // Usamos 'as' para converter explicitamente para HCaptchaResponse
    const result = (await response.json()) as HCaptchaResponse;

    if (!result.success) {
      throw new AppError("Falha ao verificar o hCaptcha");
    }
  } catch (error) {
    // Aqui você pode lidar com o erro conforme necessário
    throw new AppError("Erro ao verificar o hCaptcha");
  }
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, hCaptchaToken } = req.body;
  // Verifica o hCaptcha
  await verifyHCaptcha(hCaptchaToken);

  const { token, serializedUser, refreshToken } = await AuthUserService({
    email,
    password
  });

  SendRefreshToken(res, refreshToken);

  const io = getIO();
  io.emit(`company-${serializedUser.companyId}-auth`, {
    action: "update",
    user: {
      id: serializedUser.id,
      email: serializedUser.email,
      companyId: serializedUser.companyId
    }
  });

  return res.status(200).json({
    token,
    user: serializedUser
  });
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const token: string = req.cookies.jrt;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  const { user, newToken, refreshToken } = await RefreshTokenService(
    res,
    token
  );

  SendRefreshToken(res, refreshToken);

  return res.json({ token: newToken, user });
};

export const me = async (req: Request, res: Response): Promise<Response> => {
  const token: string = req.cookies.jrt;
  const user = await FindUserFromToken(token);
  const { id, profile, super: superAdmin } = user;

  if (!token) {
    throw new AppError("ERR_SESSION_EXPIRED", 401);
  }

  return res.json({ id, profile, super: superAdmin });
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.user;
  const user = await User.findByPk(id);
  await user.update({ online: false });

  res.clearCookie("jrt");

  return res.send();
};