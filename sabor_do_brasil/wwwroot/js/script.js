// script.js - Funções JS extraídas de index.html e cadastro.html

// --- INDEX.HTML ---

if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
    document.addEventListener('DOMContentLoaded', function () {
        const loginBtn = document.querySelector('.btn.btn-branco.border-laranja:last-child');
        if (loginBtn) {
            loginBtn.addEventListener('click', async function () {
                const email = document.getElementById('nome').value;
                const senha = document.getElementById('senha').value;

                const resposta = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, senha })
                });

                if (resposta.ok) {
                    const usuario = await resposta.json();
                    localStorage.setItem('usuarioId', usuario.id);
                    localStorage.setItem('usuarioNome', usuario.nome);
                    window.location.href = "index.html";
                } else {
                    alert("Usuário ou senha inválidos!");
                }
            });
        }

        carregarPerfilUsuario();
    });
}

function logout() {
    localStorage.removeItem('usuarioId');
    window.location.reload();
}

async function carregarPerfilUsuario() {
    const idUsuario = localStorage.getItem('usuarioId');
    const fotoPerfil = document.getElementById('fotoPerfil');
    const nomePerfil = document.getElementById('nomePerfil');
    const curtidasPerfil = document.getElementById('curtidasPerfil');

    if (idUsuario) {
        const resposta = await fetch(`/api/usuarios/${idUsuario}`);
        if (resposta.ok) {
            const usuario = await resposta.json();
            fotoPerfil.src = usuario.foto && usuario.foto !== "" ? usuario.foto : "img/images__2_-removebg-preview.png";
            nomePerfil.textContent = usuario.nome;
            curtidasPerfil.textContent = usuario.curtidas;
        } else {
            fotoPerfil.removeAttribute('src');
            nomePerfil.textContent = '@usuario';
            curtidasPerfil.textContent = '0';
        }
    } else {
        fotoPerfil.removeAttribute('src');
        nomePerfil.textContent = '@usuario';
        curtidasPerfil.textContent = '0';
    }
}

function toggleComentarios(id) {
    const area = document.getElementById('comentarios-abaixo-' + id);
    if (area.style.display === 'none' || area.style.display === '') {
        area.style.display = 'block';
        renderizarComentarios(id);
    } else {
        area.style.display = 'none';
    }
}

function renderizarComentarios(id) {
    const lista = document.getElementById('lista-comentarios-' + id);
    const comentarios = comentariosPorPublicacao[id] || [];
    const usuarioLogado = localStorage.getItem('usuarioNome') || "Usuário";
    lista.innerHTML = comentarios.length
        ? `<div class="text-start">` +
            comentarios.map((c, idx) => {
                let acoes = '';
                if (c.usuario === usuarioLogado) {
                    acoes = `
                        <div class="dropdown">
                            <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-three-dots-vertical"></i>
                            </button>
                            <ul class="dropdown-menu">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="editarComentario(${id}, ${idx}); return false;">
                                        <i class="bi bi-pencil"></i> Editar
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item text-danger" href="#" onclick="excluirComentario(${id}, ${idx}); return false;">
                                        <i class="bi bi-trash"></i> Excluir
                                    </a>
                                </li>
                            </ul>
                        </div>
                    `;
                }
                return `
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <span><strong>${c.usuario}:</strong> ${c.texto}</span>
                        ${acoes}
                    </div>
                `;
            }).join('') +
          `</div>`
        : "<p class='text-muted text-start'>Nenhum comentário ainda.</p>";
}

function adicionarComentario(event, id) {
    event.preventDefault();
    const input = document.getElementById('input-comentario-' + id);
    const texto = input.value.trim();
    if (!texto) return;
    const usuarioLogado = localStorage.getItem('usuarioNome') || "Usuário";
    comentariosPorPublicacao[id] = comentariosPorPublicacao[id] || [];
    comentariosPorPublicacao[id].push({ usuario: usuarioLogado, texto });
    input.value = '';
    renderizarComentarios(id);
}

function excluirComentario(idPublicacao, idxComentario) {
    if (confirm("Deseja realmente excluir este comentário?")) {
        comentariosPorPublicacao[idPublicacao].splice(idxComentario, 1);
        renderizarComentarios(idPublicacao);
    }
}

function editarComentario(idPublicacao, idxComentario) {
    const novoTexto = prompt("Editar comentário:", comentariosPorPublicacao[idPublicacao][idxComentario].texto);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        comentariosPorPublicacao[idPublicacao][idxComentario].texto = novoTexto.trim();
        renderizarComentarios(idPublicacao);
    }
}

const comentariosPorPublicacao = {
    1: [
        { usuario: "Maria", texto: "Adorei esse prato!" },
        { usuario: "João", texto: "Muito saboroso!" }
    ],
    2: [
        { usuario: "Ana", texto: "Moqueca maravilhosa!" }
    ],
    3: [
        { usuario: "Carlos", texto: "Feijoada top demais!" },
        { usuario: "Bruna", texto: "Amo feijoada!" }
    ]
};

// --- CADASTRO.HTML ---

if (window.location.pathname.endsWith('cadastro.html')) {
    document.addEventListener('DOMContentLoaded', function () {
        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(form);
                const resposta = await fetch('/api/usuarios', {
                    method: 'POST',
                    body: formData
                });
                if (resposta.ok) {
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao cadastrar usuário!');
                }
            });
        }
    });
}

// Valores iniciais
let likes = { 1: 4, 2: 10, 3: 15 };
let deslikes = { 1: 1, 2: 2, 3: 3 };

// Estado do voto do usuário (like, deslike ou null)
let votosUsuario = JSON.parse(localStorage.getItem('votosUsuario')) || {};

// Atualiza a interface ao carregar
function atualizarLikesDeslikes(id) {
    document.getElementById('like-' + id).textContent = likes[id];
    document.getElementById('deslike-' + id).textContent = deslikes[id];

    const likeIcon = document.querySelector('#btn-like-' + id + ' i');
    const deslikeIcon = document.querySelector('#btn-deslike-' + id + ' i');
    likeIcon.classList.remove('icone-votado', 'text-primary');
    deslikeIcon.classList.remove('icone-votado', 'text-primary');

    if (votosUsuario[id] === 'like') {
        likeIcon.classList.add('icone-votado');
        deslikeIcon.classList.add('text-primary');
    } else if (votosUsuario[id] === 'deslike') {
        deslikeIcon.classList.add('icone-votado');
        likeIcon.classList.add('text-primary');
    } else {
        likeIcon.classList.add('text-primary');
        deslikeIcon.classList.add('text-primary');
    }
}

// Função para dar like
function darLike(id) {
    if (votosUsuario[id] === 'like') {
        // Se já deu like, desfaz o like
        likes[id]--;
        votosUsuario[id] = null;
    } else {
        if (votosUsuario[id] === 'deslike') {
            deslikes[id]--;
        }
        likes[id]++;
        votosUsuario[id] = 'like';
    }
    localStorage.setItem('votosUsuario', JSON.stringify(votosUsuario));
    atualizarLikesDeslikes(id);
}

// Função para dar deslike
function darDeslike(id) {
    if (votosUsuario[id] === 'deslike') {
        // Se já deu deslike, desfaz o deslike
        deslikes[id]--;
        votosUsuario[id] = null;
    } else {
        if (votosUsuario[id] === 'like') {
            likes[id]--;
        }
        deslikes[id]++;
        votosUsuario[id] = 'deslike';
    }
    localStorage.setItem('votosUsuario', JSON.stringify(votosUsuario));
    atualizarLikesDeslikes(id);
}

// Atualiza todos ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    Object.keys(likes).forEach(id => atualizarLikesDeslikes(id));
});
