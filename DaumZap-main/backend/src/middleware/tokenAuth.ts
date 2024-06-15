import { Request, Response, NextFunction } from "express";

import AppError from "../errors/AppError";
import Whatsapp from "../models/Whatsapp";

type HeaderParams = {
  Bearer: string;
};

const tokenAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // const token = req.headers.authorization.replace('Bearer ', '');
    let token = req.headers.authorization;
    // Verifica se há um token no cabeçalho 'Authorization' (Bearer)
    if (token) {
      token = token.replace('Bearer ', '');
    } else if (req.body && req.body.token) {
      // Verifica se há um token no corpo da requisição
      token = req.body.token;
    } else {
      throw new Error();
    }

    const whatsapp = await Whatsapp.findOne({ where: { token } });

    if (whatsapp) {
      req.params = {
        whatsappId: whatsapp.id.toString()
      }
    } else {
      throw new Error();
    }
  } catch (err) {
    throw new AppError(
      "Acesso não permitido",
      401
    );
  }

  return next();
};

export default tokenAuth;
