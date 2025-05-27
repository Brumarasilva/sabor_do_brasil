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
    lista.innerHTML = comentarios.length
        ? `<div class="text-start">` +
            comentarios.map((c, idx) =>
                `<div class="d-flex align-items-center justify-content-between mb-1">
                    <span><strong>${c.usuario}:</strong> ${c.texto}</span>
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
                </div>`
            ).join('') +
          `</div>`
        : "<p class='text-muted text-start'>Nenhum comentário ainda.</p>";
}

function adicionarComentario(event, id) {
    event.preventDefault();
    const input = document.getElementById('input-comentario-' + id);
    const texto = input.value.trim();
    if (!texto) return;
    comentariosPorPublicacao[id] = comentariosPorPublicacao[id] || [];
    comentariosPorPublicacao[id].push({ usuario: "Usuário", texto });
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
