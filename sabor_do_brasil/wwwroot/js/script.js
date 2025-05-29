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
    const deslikesPerfil = document.getElementById('deslikesPerfil');
    const fotoSalva = localStorage.getItem('usuarioFoto');
    const nomeSalvo = localStorage.getItem('usuarioNome'); // <-- pega o nome salvo

    if (idUsuario) {
        const resposta = await fetch(`/api/usuarios/${idUsuario}`);
        if (resposta.ok) {
            const usuario = await resposta.json();
            fotoPerfil.src = fotoSalva || "img/images__2_-removebg-preview.png";
            nomePerfil.textContent = "@" + ((usuario.nome || nomeSalvo || "usuario").replace(/\s+/g, ''));
            curtidasPerfil.textContent = usuario.curtidas;
            deslikesPerfil.textContent = usuario.deslikes;
        } else {
            fotoPerfil.removeAttribute('src');
            nomePerfil.textContent = "@" + ((nomeSalvo || "usuario").replace(/\s+/g, ''));
            curtidasPerfil.textContent = '0';
            deslikesPerfil.textContent = '0';
        }
    } else if (fotoSalva || nomeSalvo) {
        if (fotoSalva) fotoPerfil.src = fotoSalva;
        nomePerfil.textContent = "@" + ((nomeSalvo || "usuario").replace(/\s+/g, ''));
        curtidasPerfil.textContent = '0';
        deslikesPerfil.textContent = '0';
    } else {
        fotoPerfil.removeAttribute('src');
        nomePerfil.textContent = '@usuario';
        curtidasPerfil.textContent = '0';
        deslikesPerfil.textContent = '0';
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
    lista.innerHTML = comentarios.map((c, idx) => `
        <div class="mb-2">
            <div>
                <strong>${c.usuario}:</strong> ${c.texto}
                <a href="#" class="ms-2 small" onclick="mostrarResposta(${id}, ${idx}); return false;">Responder</a>
                <a href="#" class="ms-2" onclick="curtirComentario(${id}, ${idx}); return false;">
                    <i class="bi bi-heart${c.curtido ? '-fill text-danger' : ''}" id="heart-comentario-${id}-${idx}"></i>
                    ${c.curtido ? `<img src="${localStorage.getItem('usuarioFoto') || 'img/images__2_-removebg-preview.png'}" alt="Perfil" class="ms-1 rounded-circle" style="width:20px;height:20px;object-fit:cover;vertical-align:middle;">` : ''}
                </a>
            </div>
            <div id="resposta-area-${id}-${idx}" style="display:none; margin-top:5px;">
                <div class="input-group input-group-sm">
                    <input type="text" class="form-control" id="input-resposta-${id}-${idx}" placeholder="Responder a ${c.usuario}">
                    <button class="btn btn-link" onclick="enviarResposta(${id}, ${idx})" title="Enviar">
                        <i class="bi bi-send"></i>
                    </button>
                    <button class="btn btn-link text-danger" onclick="cancelarResposta(${id}, ${idx})" title="Cancelar">
                        <i class="bi bi-x-circle"></i>
                    </button>
                </div>
            </div>
            <div id="respostas-${id}-${idx}" style="margin-left:20px;">
                ${(c.respostas || []).map((r, rIdx) => `
                    <div class="small resposta-item" onclick="excluirResposta(${id}, ${idx}, ${rIdx})" style="cursor:pointer;">
                        <strong>${r.usuario}:</strong> ${r.texto}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
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

function editarDescricao(id) {
    // Mostra o campo de edição e esconde o texto
    document.getElementById('editar-descricao-area-' + id).style.display = 'block';
    const p = document.getElementById('descricao-' + id);
    document.getElementById('input-descricao-' + id).value = p.textContent;
    p.style.display = 'none';
}

function cancelarEdicaoDescricao(id) {
    // Esconde o campo de edição e mostra o texto
    document.getElementById('editar-descricao-area-' + id).style.display = 'none';
    document.getElementById('descricao-' + id).style.display = 'block';
}

function salvarDescricao(id) {
    const novaDescricao = document.getElementById('input-descricao-' + id).value.trim();
    if (novaDescricao) {
        document.getElementById('descricao-' + id).textContent = novaDescricao;
        // Opcional: salvar no localStorage para manter após recarregar
        localStorage.setItem('descricaoPub' + id, novaDescricao);
    }
    cancelarEdicaoDescricao(id);
}

// Ao carregar a página, recupere descrições salvas (opcional)
document.addEventListener('DOMContentLoaded', function () {
    [1,2,3].forEach(function(id) {
        const desc = localStorage.getItem('descricaoPub' + id);
        if (desc) {
            const p = document.getElementById('descricao-' + id);
            if (p) p.textContent = desc;
        }
    });
});

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
        // Captura a foto e salva em base64 no localStorage
        const fotoInput = document.getElementById('fotoUsuario');
        if (fotoInput) {
            fotoInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = function(e) {
                    localStorage.setItem('usuarioFoto', e.target.result);
                };
                reader.readAsDataURL(file);
            });
        }

        const form = document.querySelector('form');
        if (form) {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(form);
                const nome = document.getElementById('nomeCompleto').value; // <-- pega o nome digitado
                const resposta = await fetch('/api/usuarios', {
                    method: 'POST',
                    body: formData
                });
                if (resposta.ok) {
                    localStorage.setItem('usuarioNome', nome); // <-- salva o nome no localStorage
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

function atualizarTotaisPerfil() {
    // Some todos os likes e deslikes dos cards
    let totalLikes = 0;
    let totalDeslikes = 0;
    Object.values(likes).forEach(v => totalLikes += v);
    Object.values(deslikes).forEach(v => totalDeslikes += v);

    // Atualize na área do perfil
    document.getElementById('curtidasPerfil').textContent = totalLikes;
    document.getElementById('deslikesPerfil').textContent = totalDeslikes;
}

// Sempre que atualizar likes/deslikes, atualize o perfil também
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

    // Atualiza totais no perfil
    atualizarTotaisPerfil();
}

// Atualize os totais ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    atualizarTotaisPerfil();
});

document.addEventListener('DOMContentLoaded', function () {
    const nome = (localStorage.getItem('usuarioNome') || "Usuário").replace(/\s+/g, '');
    const foto = localStorage.getItem('usuarioFoto') || "img/images__2_-removebg-preview.png";
    [1, 2, 3].forEach(function (id) {
        const nomeSpan = document.getElementById('nomePub-' + id);
        const fotoImg = document.getElementById('fotoPub-' + id);
        if (nomeSpan) nomeSpan.textContent = nome;
        if (fotoImg) fotoImg.src = foto;
    });
});

function curtirComentario(idPublicacao, idxComentario) {
    const comentario = comentariosPorPublicacao[idPublicacao][idxComentario];
    comentario.curtido = !comentario.curtido;
    renderizarComentarios(idPublicacao);
}

function ocultarCurtidas(id) {
    // Esconde os elementos de like e deslike
    document.getElementById('btn-like-' + id).style.display = 'none';
    document.getElementById('like-' + id).style.display = 'none';
    document.getElementById('btn-deslike-' + id).style.display = 'none';
    document.getElementById('deslike-' + id).style.display = 'none';
    // Mostra o botão de mostrar curtidas
    document.getElementById('btn-mostrar-curtidas-' + id).style.display = 'inline-block';
}

function mostrarCurtidas(id) {
    document.getElementById('btn-like-' + id).style.display = '';
    document.getElementById('like-' + id).style.display = '';
    document.getElementById('btn-deslike-' + id).style.display = '';
    document.getElementById('deslike-' + id).style.display = '';
    // Esconde o botão de mostrar curtidas
    document.getElementById('btn-mostrar-curtidas-' + id).style.display = 'none';
}

function desativarComentarios(id) {
    // Esconde a área dos comentários
    var comentarios = document.getElementById('comentarios-abaixo-' + id);
    if (comentarios) comentarios.style.display = 'none';
    // Mostra o botão de mostrar comentários
    document.getElementById('btn-mostrar-comentarios-' + id).style.display = 'inline-block';
    // Opcional: desabilita o botão de ver comentários
    var btnComentario = document.querySelector('[onclick="toggleComentarios(' + id + '); return false;"]');
    if (btnComentario) btnComentario.style.display = 'none';
}

function mostrarComentarios(id) {
    var comentarios = document.getElementById('comentarios-abaixo-' + id);
    if (comentarios) comentarios.style.display = '';
    // Esconde o botão de mostrar comentários
    document.getElementById('btn-mostrar-comentarios-' + id).style.display = 'none';
    // Reabilita o botão de ver comentários
    var btnComentario = document.querySelector('[onclick="toggleComentarios(' + id + '); return false;"]');
    if (btnComentario) btnComentario.style.display = '';
}

// Controle de estado
let curtidasOcultas = { 1: false, 2: false, 3: false };
let comentariosOcultos = { 1: false, 2: false, 3: false };

function alternarCurtidas(id) {
    curtidasOcultas[id] = !curtidasOcultas[id];
    if (curtidasOcultas[id]) {
        // Oculta curtidas
        document.getElementById('btn-like-' + id).style.display = 'none';
        document.getElementById('like-' + id).style.display = 'none';
        document.getElementById('btn-deslike-' + id).style.display = 'none';
        document.getElementById('deslike-' + id).style.display = 'none';
        document.getElementById('opcao-curtidas-' + id).textContent = 'Mostrar curtidas';
    } else {
        // Mostra curtidas
        document.getElementById('btn-like-' + id).style.display = '';
        document.getElementById('like-' + id).style.display = '';
        document.getElementById('btn-deslike-' + id).style.display = '';
        document.getElementById('deslike-' + id).style.display = '';
        document.getElementById('opcao-curtidas-' + id).textContent = 'Ocultar número de curtidas';
    }
}

function alternarComentarios(id) {
    comentariosOcultos[id] = !comentariosOcultos[id];
    const comentarios = document.getElementById('comentarios-abaixo-' + id);
    const btnComentario = document.querySelector('[onclick="toggleComentarios(' + id + '); return false;"]');
    if (comentariosOcultos[id]) {
        // Oculta comentários
        if (comentarios) comentarios.style.display = 'none';
        if (btnComentario) btnComentario.style.display = 'none';
        document.getElementById('opcao-comentarios-' + id).textContent = 'Mostrar comentários';
    } else {
        // Mostra comentários
        if (comentarios) comentarios.style.display = '';
        if (btnComentario) btnComentario.style.display = '';
        document.getElementById('opcao-comentarios-' + id).textContent = 'Desativar comentários';
    }
}

function mostrarResposta(id, idx) {
    document.getElementById(`resposta-area-${id}-${idx}`).style.display = 'block';
}

function cancelarResposta(id, idx) {
    document.getElementById(`resposta-area-${id}-${idx}`).style.display = 'none';
    document.getElementById(`input-resposta-${id}-${idx}`).value = '';
}

function enviarResposta(id, idx) {
    const input = document.getElementById(`input-resposta-${id}-${idx}`);
    const texto = input.value.trim();
    if (texto) {
        const usuario = localStorage.getItem('usuarioNome') || "Usuário";
        if (!comentariosPorPublicacao[id][idx].respostas) {
            comentariosPorPublicacao[id][idx].respostas = [];
        }
        comentariosPorPublicacao[id][idx].respostas.push({ usuario, texto });
        renderizarComentarios(id);
    }
}

function excluirResposta(id, idxComentario, idxResposta) {
    if (confirm("Deseja excluir esta resposta?")) {
        comentariosPorPublicacao[id][idxComentario].respostas.splice(idxResposta, 1);
        renderizarComentarios(id);
    }
}
