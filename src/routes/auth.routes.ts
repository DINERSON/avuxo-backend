import { Express } from 'express';

export function registerAuthRoutes(app: Express) {

  app.post('/auth/register', (req, res) => {

    res.json({
      success: true,
      user: {
        id: Date.now(),
        name: req.body.name || 'Usuário AVUXO',
        phone: req.body.phone,
        email: req.body.email,
        role: req.body.role || 'driver',
      },
    });

  });

  app.post('/auth/send-otp', (req, res) => {

    console.log(
      '📲 OTP enviado para:',
      req.body.phone,
    );

    res.json({
      success: true,
      verificationId: '123456',
      message: 'OTP enviado com sucesso',
    });

  });

  app.post('/auth/verify-otp', (req, res) => {

    res.json({
      success: true,
      token: 'avuxo-token-dev',
      user: {
        id: Date.now(),
        name: 'Usuário AVUXO',
        phone: req.body.phone,
        role: req.body.role || 'driver',
      },
    });

  });

}