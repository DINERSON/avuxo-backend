import { Express } from 'express';

export function registerLoginRoutes(app: Express) {
  app.get('/login', (_req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8" />

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
/>

<title>
  AVUXO Admin Login
</title>

<style>

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  min-height:100vh;
  display:flex;
  justify-content:center;
  align-items:center;

  background:
    radial-gradient(
      circle at top left,
      rgba(36,248,119,0.18),
      transparent 35%
    ),
    radial-gradient(
      circle at 90% 10%,
      rgba(36,248,119,0.08),
      transparent 30%
    ),
    #050609;

  font-family:Arial,sans-serif;
  color:white;
}

.card{

  width:100%;
  max-width:460px;

  padding:40px;

  border-radius:32px;

  background:
    rgba(255,255,255,0.04);

  border:
    1px solid rgba(255,255,255,0.08);

  backdrop-filter:blur(20px);

  box-shadow:
    0 30px 80px rgba(0,0,0,0.45);

}

.logo{

  text-align:center;

  color:#24F877;

  font-size:52px;

  font-weight:900;

  letter-spacing:6px;

  text-shadow:
    0 0 35px rgba(36,248,119,0.4);

}

.sub{

  text-align:center;

  margin-top:10px;

  color:#8c96a8;

  letter-spacing:3px;

  font-size:12px;

}

.form{

  margin-top:35px;

  display:grid;

  gap:16px;

}

input{

  width:100%;

  padding:16px;

  border-radius:16px;

  border:none;

  outline:none;

  background:
    rgba(255,255,255,0.05);

  color:white;

}

button{

  border:none;

  cursor:pointer;

  padding:16px;

  border-radius:16px;

  font-weight:900;

  background:#24F877;

  color:black;

}

.error{

  margin-top:16px;

  text-align:center;

  color:#ff5f5f;

}

.loading{

  opacity:.7;

  pointer-events:none;

}

</style>

</head>

<body>

<div class="card">

  <div class="logo">
    AVUXO
  </div>

  <div class="sub">
    COMMAND CENTER
  </div>

  <div class="form">

    <input
      id="username"
      placeholder="Usuário"
      value="admin"
    />

    <input
      id="password"
      type="password"
      placeholder="Senha"
    />

    <button onclick="login()">
      Entrar
    </button>

  </div>

  <div
    class="error"
    id="error"
  ></div>

</div>

<script>

async function login(){

  const username =
    document.getElementById(
      'username'
    ).value;

  const password =
    document.getElementById(
      'password'
    ).value;

  const error =
    document.getElementById(
      'error'
    );

  error.innerHTML = '';

  try{

    const response =
      await fetch(
        '/admin-auth/login',
        {
          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:JSON.stringify({
            username,
            password
          })
        }
      );

    const data =
      await response.json();

    if(!data.success){

      error.innerHTML =
        data.message ||
        'Erro ao autenticar';

      return;
    }

    localStorage.setItem(
      'avuxo_admin_token',
      data.token
    );

    window.location.href =
      '/admin';

  }
  catch(e){

    error.innerHTML =
      'Erro ao conectar';

  }

}

</script>

</body>

</html>
    `);
  });
}