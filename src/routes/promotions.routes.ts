import { Express } from 'express';

type Promotion = {
  id: string;
  code: string;
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  active: boolean;
};

const promotions: Promotion[] = [
  {
    id: 'promo_001',
    code: 'AVUXO50',
    title: 'Primeira corrida',
    discount: '50% OFF',
    description: 'Ganhe até 50% de desconto na sua primeira corrida AVUXO.',
    validUntil: '2026-12-31T23:59:59.000Z',
    active: true,
  },
  {
    id: 'promo_002',
    code: 'INDIQUE10',
    title: 'Indique amigos',
    discount: 'R$ 10',
    description: 'Convide amigos e ganhe créditos para usar em corridas.',
    validUntil: '2026-12-31T23:59:59.000Z',
    active: true,
  },
];

const redeemedPromotions: any[] = [];

export function registerPromotionsRoutes(app: Express) {
  app.get('/promotions', (_req, res) => {
    res.json({
      success: true,
      promotions: promotions.filter((promo) => promo.active),
    });
  });

  app.post('/promotions/redeem', (req, res) => {
    const code = String(req.body.code || '').trim().toUpperCase();

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Código da promoção é obrigatório.',
      });
    }

    const promotion = promotions.find(
      (promo) => promo.code.toUpperCase() === code && promo.active,
    );

    if (!promotion) {
      return res.status(404).json({
        success: false,
        message: 'Promoção não encontrada ou inativa.',
      });
    }

    redeemedPromotions.push({
      id: Date.now().toString(),
      promotionId: promotion.id,
      code: promotion.code,
      redeemedAt: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: 'Promoção resgatada com sucesso.',
      promotion,
    });
  });
}