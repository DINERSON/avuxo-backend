import { Express, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type UserRole = 'passenger' | 'driver' | 'admin';

interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

const usersByPhone = new Map<string, AuthUser>();
const otpByPhone = new Map<
  string,
  {
    code: string;
    verificationId: string;
    expiresAt: number;
  }
>();

function normalizePhone(phone: any): string {
  return String(phone || '').replace(/\D/g, '');
}

function createToken(user: AuthUser): string {
  const secret = process.env.JWT_SECRET || 'avuxo-secret-dev';

  return jwt.sign(
    {
      id: user.id,
      phone: user.phone,
      role: user.role,
    },
    secret,
    {
      expiresIn: '7d',
    },
  );
}

function getOrCreateUser(data: {
  name?: string;
  phone: string;
  email?: string;
  role?: UserRole;
}): AuthUser {
  const phone = normalizePhone(data.phone);
  const now = new Date().toISOString();

  const existing = usersByPhone.get(phone);

  if (existing) {
    existing.name = data.name || existing.name;
    existing.email = data.email || existing.email;
    existing.role = data.role || existing.role;
    existing.updatedAt = now;

    return existing;
  }

  const user: AuthUser = {
    id: phone,
    name: data.name || 'Usuário AVUXO',
    phone,
    email: data.email,
    role: data.role || 'driver',
    createdAt: now,
    updatedAt: now,
  };

  usersByPhone.set(phone, user);

  return user;
}

export function registerAuthRoutes(app: Express) {
  app.post('/auth/register', (req: Request, res: Response) => {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Telefone é obrigatório.',
      });
    }

    const role = (req.body.role || 'driver') as UserRole;

    const user = getOrCreateUser({
      name: req.body.name || req.body.fullName,
      phone,
      email: req.body.email,
      role,
    });

    return res.json({
      success: true,
      user,
    });
  });

  app.post('/auth/send-otp', (req: Request, res: Response) => {
    const phone = normalizePhone(req.body.phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Telefone é obrigatório.',
      });
    }

    const isProduction = process.env.NODE_ENV === 'production';

    const code = isProduction
      ? String(Math.floor(100000 + Math.random() * 900000))
      : '123456';

    const verificationId = `otp-${phone}-${Date.now()}`;

    otpByPhone.set(phone, {
      code,
      verificationId,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    console.log('📲 OTP AVUXO:', {
      phone,
      code,
      verificationId,
    });

    return res.json({
      success: true,
      verificationId,
      message: 'OTP enviado com sucesso.',
      devCode: isProduction ? undefined : code,
    });
  });

  app.post('/auth/verify-otp', (req: Request, res: Response) => {
    const phone = normalizePhone(req.body.phone);
    const code = String(req.body.code || req.body.otp || '');
    const role = (req.body.role || 'driver') as UserRole;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Telefone é obrigatório.',
      });
    }

    const otp = otpByPhone.get(phone);

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: 'OTP não solicitado ou expirado.',
      });
    }

    if (Date.now() > otp.expiresAt) {
      otpByPhone.delete(phone);

      return res.status(400).json({
        success: false,
        message: 'OTP expirado.',
      });
    }

    if (code !== otp.code) {
      return res.status(401).json({
        success: false,
        message: 'Código OTP inválido.',
      });
    }

    const user = getOrCreateUser({
      name: req.body.name || req.body.fullName || 'Usuário AVUXO',
      phone,
      email: req.body.email,
      role,
    });

    otpByPhone.delete(phone);

    const token = createToken(user);

    return res.json({
      success: true,
      token,
      user,
    });
  });
}