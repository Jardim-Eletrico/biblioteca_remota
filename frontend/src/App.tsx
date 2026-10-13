import { useState, type FormEvent, type CSSProperties } from "react";
import { login, cadastro, logout } from "./services/authService";

type Tela = "login" | "cadastro" | "logado";

export default function App() {
  const [tela, setTela] = useState<Tela>("login");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");

  function limparFormulario() {
    setEmail("");
    setPassword("");
    setNome("");
    setErro("");
  }

  function trocarTela(nova: Tela) {
    setTela(nova);
    limparFormulario();
    setMensagem("");
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const data = await login(email, password);
      setMensagem(`✅ Logado! Token: ${data.access.slice(0, 20)}...`);
      setTela("logado");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(e: FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      await cadastro({ email, password, nome });
      setMensagem("✅ Cadastro feito! Agora faça login.");
      setTela("login");
      setPassword("");
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setCarregando(false);
    }
  }

  function handleLogout() {
    logout();
    setTela("login");
    limparFormulario();
    setMensagem("Você saiu.");
  }

  if (tela === "logado") {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1>🎉 Bem-vindo!</h1>
          <p>{mensagem}</p>
          <button style={styles.botao} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  const isLogin = tela === "login";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>{isLogin ? "Entrar" : "Criar conta"}</h1>

        <form onSubmit={isLogin ? handleLogin : handleCadastro}>
          <div style={styles.campo}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={carregando}
              style={styles.input}
            />
          </div>

          {!isLogin && (
            <div style={styles.campo}>
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                disabled={carregando}
                style={styles.input}
              />
            </div>
          )}

          <div style={styles.campo}>
            <label>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={carregando}
              style={styles.input}
            />
          </div>

          {erro && <p style={styles.erro}>❌ {erro}</p>}
          {mensagem && <p style={styles.sucesso}>{mensagem}</p>}

          <button
            type="submit"
            disabled={carregando}
            style={{
              ...styles.botao,
              opacity: carregando ? 0.6 : 1,
              cursor: carregando ? "not-allowed" : "pointer",
            }}
          >
            {carregando ? "Aguarde..." : isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>

        <p style={styles.rodape}>
          {isLogin ? "Não tem conta?" : "Já tem conta?"}{" "}
          <button
            type="button"
            onClick={() => trocarTela(isLogin ? "cadastro" : "login")}
            style={styles.link}
          >
            {isLogin ? "Cadastre-se" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f0f2f5",
    fontFamily: "system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    padding: 32,
    borderRadius: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: 400,
  },
  campo: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  input: {
    padding: "10px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  botao: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 8,
  },
  erro: {
    color: "#dc2626",
    fontSize: 14,
    margin: "8px 0",
    whiteSpace: "pre-wrap",
  },
  sucesso: {
    color: "#16a34a",
    fontSize: 14,
    margin: "8px 0",
  },
  rodape: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  link: {
    background: "none",
    border: "none",
    color: "#2563eb",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
    padding: 0,
  },
};