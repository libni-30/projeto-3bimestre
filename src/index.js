// Importar as bibliotecas necessárias
import express from "express";
import dotenv from "dotenv";
import prisma from "./db.js"; // Importar nossa conexão com o banco

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Criar aplicação Express
const app = express();

// Middleware para processar JSON nas requisições
app.use(express.json());

//Healthcheck
app.get("/", (_req, res) => res.json({ ok: true, service: "API 3º Bimestre" }));

//CREATE: POST /usuarios
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const novoUsuario = await prisma.user.create({
      data: { name, email, password }
    });

    res.status(201).json(novoUsuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }

    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

//READ: GET /usuarios
app.get("/usuarios", async (_req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      include: { store: true },
      orderBy: { id: "asc" }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
});

//READ: GET /usuarios/:id
app.get("/usuarios/:id", async (req, res) => {
  try {
    const usuario = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      include: { store: { include: { products: true } } }
    });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

//UPDATE: PUT /usuarios/:id
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const usuario = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: { name, email, password },
      include: { store: true }
    });
    res.json(usuario);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "E-mail já cadastrado" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

//DELETE: DELETE /usuarios/:id
app.delete("/usuarios/:id", async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

//ROTA DE TESTE
app.get("/status", (req, res) => {
  res.json({ message: "API Online" });
});

// === ROTAS PARA STORES ===

//CREATE: POST /stores
app.post('/stores', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const store = await prisma.store.create({
      data: { name, userId: Number(userId) },
      include: { user: true }
    });
    res.status(201).json(store);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Usuário já possui uma loja" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    res.status(400).json({ error: error.message });
  }
});

//READ: GET /stores
app.get('/stores', async (_req, res) => {
  try {
    const stores = await prisma.store.findMany({
      include: { user: true, products: true },
      orderBy: { id: "asc" }
    });
    res.json(stores);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar lojas" });
  }
});

//READ: GET /stores/:id -> retorna loja + user (dono) + produtos
app.get('/stores/:id', async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: Number(req.params.id) },
      include: { user: true, products: true }
    });
    if (!store) return res.status(404).json({ error: 'Loja não encontrada' });
    res.json(store);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//UPDATE: PUT /stores/:id
app.put('/stores/:id', async (req, res) => {
  try {
    const { name, userId } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (userId !== undefined) updateData.userId = Number(userId);
    
    const store = await prisma.store.update({
      where: { id: Number(req.params.id) },
      data: updateData,
      include: { user: true, products: true }
    });
    res.json(store);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Usuário já possui uma loja" });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Loja não encontrada" });
    }
    res.status(500).json({ error: "Erro ao atualizar loja" });
  }
});

//DELETE: DELETE /stores/:id
app.delete('/stores/:id', async (req, res) => {
  try {
    await prisma.store.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Loja não encontrada" });
    }
    res.status(500).json({ error: "Erro ao deletar loja" });
  }
});

// === ROTAS PARA PRODUCTS ===

//CREATE: POST /products
app.post('/products', async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    const product = await prisma.product.create({
      data: { name, price: Number(price), storeId: Number(storeId) },
      include: { store: { include: { user: true } } }
    });
    res.status(201).json(product);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Loja não encontrada" });
    }
    res.status(400).json({ error: error.message });
  }
});

//READ: GET /products -> inclui a loja e o dono da loja
app.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { store: { include: { user: true } } },
      orderBy: { id: "asc" }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar produtos" });
  }
});

//READ: GET /products/:id
app.get('/products/:id', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { store: { include: { user: true } } }
    });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//UPDATE: PUT /products/:id
app.put('/products/:id', async (req, res) => {
  try {
    const { name, price, storeId } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (storeId !== undefined) updateData.storeId = Number(storeId);
    
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: updateData,
      include: { store: { include: { user: true } } }
    });
    res.json(product);
  } catch (error) {
    if (error.code === "P2003") {
      return res.status(400).json({ error: "Loja não encontrada" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

//DELETE: DELETE /products/:id
app.delete('/products/:id', async (req, res) => {
  try {
    await prisma.product.delete({
      where: { id: Number(req.params.id) }
    });
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.status(500).json({ error: "Erro ao deletar produto" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
