const scrollContainer = document.querySelector(".scroll-wrapper");

if (scrollContainer) {
  scrollContainer.addEventListener(
    "wheel",
    (evt) => {
      evt.preventDefault();
      scrollContainer.scrollLeft += evt.deltaY;
    },
    { passive: false },
  );
}

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", (e) => {
    const opened = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", opened ? "true" : "false");
    e.stopPropagation();
  });

  mainNav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });

  document.addEventListener("click", (e) => {
    if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const Carrinho = {
  obter() {
    const dados = localStorage.getItem("carrinho");
    return dados ? JSON.parse(dados) : [];
  },

  salvar(itens) {
    localStorage.setItem("carrinho", JSON.stringify(itens));
  },

  adicionar(produto) {
    const itens = this.obter();
    const itemExistente = itens.find((item) => item.id === produto.id);

    if (itemExistente) {
      itemExistente.quantidade += produto.quantidade || 1;
    } else {
      itens.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        imagem: produto.imagem,
        quantidade: produto.quantidade || 1,
      });
    }

    this.salvar(itens);
    return itens;
  },

  remover(produtoId) {
    const itens = this.obter();
    const filtrado = itens.filter((item) => item.id !== produtoId);
    this.salvar(filtrado);
    return filtrado;
  },

  atualizar(produtoId, quantidade) {
    const itens = this.obter();
    const item = itens.find((item) => item.id === produtoId);
    if (item) {
      item.quantidade = Math.max(1, quantidade);
      this.salvar(itens);
    }
    return itens;
  },

  limpar() {
    localStorage.removeItem("carrinho");
  },
};

function adicionarAoCarrinho(produtoId, nomeProduto, precoProduto) {
  let precoNumerico = precoProduto.replace(/[^\d,.-]/g, "").replace(",", ".");
  precoNumerico = parseFloat(precoNumerico) || 0;

  const produto = {
    id: produtoId,
    nome: nomeProduto,
    preco: precoNumerico,
    quantidade: 1,
  };

  Carrinho.adicionar(produto);
  window.location.href = "compra.html";
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".cardapio-container")) {
    const botoes = document.querySelectorAll(".btn-comprar");
    botoes.forEach((botao) => {
      botao.addEventListener("click", (e) => {
        e.preventDefault();
        const card = botao.closest(".produto-card");
        const nome = card.querySelector(".produto-info h3").textContent;
        const preco = card.querySelector(".produto-preco").textContent;
        const id = nome.toLowerCase().replace(/\s+/g, "-");

        adicionarAoCarrinho(id, nome, preco);
      });
    });
  }

  if (document.querySelector(".compra-container")) {
    renderizarCarrinho();

    const opcoesEntrega = document.querySelectorAll(
      'input[name="tipoEntrega"]',
    );
    opcoesEntrega.forEach((opcao) => {
      opcao.addEventListener("change", () => {
        calcularTotal();
      });
    });

    const btnFinalizar = document.querySelector(".btn-finalizar");
    if (btnFinalizar) {
      btnFinalizar.addEventListener("click", () => {
        mostrarCheckout();
      });
    }

    const btnVoltarCarrinho = document.querySelector(".btn-voltar-carrinho");
    if (btnVoltarCarrinho) {
      btnVoltarCarrinho.addEventListener("click", () => {
        esconderCheckout();
      });
    }

    const formCheckout = document.getElementById("formCheckout");
    if (formCheckout) {
      formCheckout.addEventListener("submit", (e) => {
        e.preventDefault();
        finalizarCompra();
      });
    }
  }
});

function renderizarCarrinho() {
  const itens = Carrinho.obter();
  const carrinhoVazio = document.getElementById("carrinhoVazio");
  const tabelaProdutos = document.getElementById("tabelaProdutos");
  const corpoProdutos = document.getElementById("corpoProdutos");

  if (itens.length === 0) {
    carrinhoVazio.style.display = "block";
    tabelaProdutos.style.display = "none";
  } else {
    carrinhoVazio.style.display = "none";
    tabelaProdutos.style.display = "table";

    corpoProdutos.innerHTML = itens
      .map(
        (item) => `
      <tr>
        <td>${item.nome}</td>
        <td class="preco-item">R$ ${item.preco.toFixed(2)}</td>
        <td>
          <input
            type="number"
            min="1"
            value="${item.quantidade}"
            class="quantidade-input"
            onchange="atualizarQuantidade('${item.id}', this.value)"
          />
        </td>
        <td class="preco-item">R$ ${(item.preco * item.quantidade).toFixed(2)}</td>
        <td>
          <button class="btn-remover" onclick="removerDoCarrinho('${item.id}')">
            Remover
          </button>
        </td>
      </tr>
    `,
      )
      .join("");
  }

  calcularTotal();
}

function atualizarQuantidade(produtoId, novaQuantidade) {
  Carrinho.atualizar(produtoId, parseInt(novaQuantidade));
  renderizarCarrinho();
}

function removerDoCarrinho(produtoId) {
  if (confirm("Tem certeza que deseja remover este item?")) {
    Carrinho.remover(produtoId);
    renderizarCarrinho();
  }
}

function calcularTotal() {
  const itens = Carrinho.obter();
  const subtotal = itens.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );
  const tipoEntrega = document.querySelector(
    'input[name="tipoEntrega"]:checked',
  )?.value;
  const taxaEntrega = tipoEntrega === "entrega" ? 5.0 : 0;
  const desconto = 0;
  const total = subtotal + taxaEntrega - desconto;

  document.getElementById("subtotal").textContent = `R$ ${subtotal.toFixed(2)}`;
  document.getElementById("taxaEntrega").textContent =
    `R$ ${taxaEntrega.toFixed(2)}`;
  document.getElementById("desconto").textContent =
    `-R$ ${desconto.toFixed(2)}`;
  document.getElementById("total").textContent = `R$ ${total.toFixed(2)}`;
}

function mostrarCheckout() {
  const itens = Carrinho.obter();
  if (itens.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  document.querySelector(".compra-wrapper").style.display = "none";
  document.getElementById("checkoutSection").style.display = "block";

  document
    .getElementById("checkoutSection")
    .scrollIntoView({ behavior: "smooth" });
}

function esconderCheckout() {
  document.querySelector(".compra-wrapper").style.display = "grid";
  document.getElementById("checkoutSection").style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function finalizarCompra() {
  const nome = document.getElementById("nomeCliente").value;
  const email = document.getElementById("emailCliente").value;
  const telefone = document.getElementById("telefoneCliente").value;
  const itens = Carrinho.obter();
  const tipoEntrega = document.querySelector(
    'input[name="tipoEntrega"]:checked',
  )?.value;

  const pedido = {
    cliente: {
      nome,
      email,
      telefone,
      endereco: {
        rua: document.getElementById("ruaCliente").value,
        numero: document.getElementById("numeroCliente").value,
        complemento: document.getElementById("complementoCliente").value,
        bairro: document.getElementById("bairroCliente").value,
        cidade: document.getElementById("cidadeCliente").value,
        estado: document.getElementById("estadoCliente").value,
        cep: document.getElementById("cepCliente").value,
      },
      observacoes: document.getElementById("obsCliente").value,
    },
    itens,
    tipoEntrega,
    data: new Date().toLocaleString("pt-BR"),
  };

  const pedidos = JSON.parse(localStorage.getItem("pedidos") || "[]");
  pedidos.push(pedido);
  localStorage.setItem("pedidos", JSON.stringify(pedidos));

  Carrinho.limpar();

  alert(
    `Pedido realizado com sucesso! \n\nPedido de ${nome}\nTotal: R$ ${calcularTotalPedido(itens).toFixed(2)}`,
  );

  window.location.href = "cardapio.html";
}

function calcularTotalPedido(itens) {
  return itens.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
}
