import { Express } from 'express';

const AVUXO_GREEN = '#24F877';

export function registerRootRoutes(app: Express) {
  app.get('/', (_req, res) => {
    res.send(`
      <html>
        <head>
          <title>AVUXO Backend</title>

          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: #050609;
              color: white;
              font-family: Arial, sans-serif;
            }

            .box {
              padding: 40px;
              border-radius: 28px;
              background: rgba(255,255,255,0.05);
              border: 1px solid rgba(36,248,119,0.25);
              box-shadow: 0 0 80px rgba(36,248,119,0.12);
              text-align: center;
            }

            h1 {
              color: ${AVUXO_GREEN};
              letter-spacing: 4px;
            }

            p {
              color: #8c96a8;
            }
          </style>
        </head>

        <body>
          <div class="box">
            <h1>AVUXO</h1>
            <p>Backend online</p>
          </div>
        </body>
      </html>
    `);
  });
}