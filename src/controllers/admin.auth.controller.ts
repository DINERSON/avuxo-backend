import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export function adminLogin(
  req: Request,
  res: Response,
) {
  const { username, password } =
    req.body;

  const adminUser =
    process.env.ADMIN_USER || 'admin';

  const adminPassword =
    process.env.ADMIN_PASSWORD ||
    'Avuxo@2026';

  if (
    username !== adminUser ||
    password !== adminPassword
  ) {
    return res.status(401).json({
      success: false,
      message: 'Usuário ou senha inválidos.',
    });
  }

  const token = jwt.sign(
    {
      username,
      role: 'admin',
    },
    process.env.JWT_SECRET ||
      'avuxo-secret',
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        '7d',
    },
  );

  return res.json({
    success: true,
    token,
    admin: {
      username,
    },
  });
}

export function adminMe(
  req: Request,
  res: Response,
) {
  return res.json({
    success: true,
    authenticated: true,
  });
}

export function adminLogout(
  _req: Request,
  res: Response,
) {
  return res.json({
    success: true,
    message: 'Logout realizado.',
  });
}