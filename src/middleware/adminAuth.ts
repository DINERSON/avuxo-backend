import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminRequest extends Request {
  admin?: {
    username: string;
  };
}

export function adminAuth(
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const authHeader =
      req.headers.authorization || '';

    const token = authHeader.replace(
      'Bearer ',
      '',
    );

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não informado.',
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'avuxo-secret',
    ) as {
      username: string;
    };

    req.admin = {
      username: decoded.username,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
    });
  }
}