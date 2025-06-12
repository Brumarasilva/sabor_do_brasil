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
    if (confirm('Você deseja sair?')) {
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('usuarioNome');
        localStorage.removeItem('usuarioFoto');
        window.location.href = 'index.html';
    }
}

// Ao carregar o perfil, se não houver usuário logado, exibe apenas a empresa
// Se houver usuário logado, exibe apenas o perfil do usuário
async function carregarPerfilUsuario() {
    const idUsuario = localStorage.getItem('usuarioId');
    const fotoPerfil = document.getElementById('fotoPerfil');
    const nomePerfil = document.getElementById('nomePerfil');
    const curtidasPerfil = document.getElementById('curtidasPerfil');
    const deslikesPerfil = document.getElementById('deslikesPerfil');
    const fotoSalva = localStorage.getItem('usuarioFoto');
    const nomeSalvo = localStorage.getItem('usuarioNome');

    if (idUsuario) {
        const resposta = await fetch(`/api/usuarios/${idUsuario}`);
        if (resposta.ok) {
            const usuario = await resposta.json();
            fotoPerfil.src = fotoSalva || "img/images__2_-removebg-preview.png";
            nomePerfil.textContent = "@" + ((usuario.nome || nomeSalvo || "usuario").replace(/\s+/g, ''));
            curtidasPerfil.textContent = '0'; // Zera likes
            deslikesPerfil.textContent = '0'; // Zera deslikes
        } else {
            fotoPerfil.removeAttribute('src');
            nomePerfil.textContent = "@" + ((nomeSalvo || "usuario").replace(/\s+/g, ''));
            curtidasPerfil.textContent = '0';
            deslikesPerfil.textContent = '0';
        }
    } else {
        // Não há usuário logado, busca perfil da empresa
        try {
            const resposta = await fetch('/api/empresa/1');
            if (resposta.ok) {
                const empresa = await resposta.json();
                let fotoEmpresa = empresa.foto;
                if (fotoEmpresa && !fotoEmpresa.startsWith('http') && !fotoEmpresa.startsWith('/')) {
                    fotoEmpresa = '/img/' + fotoEmpresa;
                }
                fotoPerfil.src = fotoEmpresa || "/img/images__2_-removebg-preview.png";
                nomePerfil.textContent = empresa.nome ? "@" + empresa.nome.replace(/\s+/g, '') : '@sabordobrasil';
                curtidasPerfil.textContent = '0'; // Zera likes
                deslikesPerfil.textContent = '0'; // Zera deslikes
            } else {
                fotoPerfil.src = "/img/images__2_-removebg-preview.png";
                nomePerfil.textContent = '@sabordobrasil';
                curtidasPerfil.textContent = '0';
                deslikesPerfil.textContent = '0';
            }
        } catch (e) {
            fotoPerfil.src = "/img/images__2_-removebg-preview.png";
            nomePerfil.textContent = '@sabordobrasil';
            curtidasPerfil.textContent = '0';
            deslikesPerfil.textContent = '0';
        }
    }
}

// Zera likes e comentários visualmente ao carregar
let likes = { 1: 0, 2: 0, 3: 0 };
let deslikes = { 1: 0, 2: 0, 3: 0 };
const comentariosPorPublicacao = { 1: [], 2: [], 3: [] };

// Função para dar like (desativada)
function darLike(id) { return; }
function darDeslike(id) { return; }

// Atualiza a interface ao carregar

// Função para dar like (desativada)
function darLike(id) {
    // Curtidas desativadas
    return;
}

// Função para dar deslike (desativada)
function darDeslike(id) {
    // Deslikes desativados
    return;
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

    const likeIcon = document.getElementById('heart-like-' + id);
    const deslikeIcon = document.getElementById('heart-deslike-' + id);

    likeIcon.classList.remove('bi-heart-fill', 'text-danger');
    deslikeIcon.classList.remove('bi-heart-fill', 'text-danger');
    likeIcon.classList.add('bi-heart');
    deslikeIcon.classList.add('bi-heart');

    if (votosUsuario[id] === 'like') {
        likeIcon.classList.remove('bi-heart');
        likeIcon.classList.add('bi-heart-fill', 'text-danger');
    } else if (votosUsuario[id] === 'deslike') {
        deslikeIcon.classList.remove('bi-heart');
        deslikeIcon.classList.add('bi-heart-fill', 'text-danger');
    }
}

// Atualize os totais ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    atualizarTotaisPerfil();
});

document.addEventListener('DOMContentLoaded', function() {
    // Busca o nome cadastrado no localStorage
    const nomeUsuario = localStorage.getItem('usuarioNome') || 'Usuário';
    // Atualiza o nome no perfil (sem @)
    const nomeUsuarioDinamico = document.getElementById('nomeUsuarioDinamico');
    if (nomeUsuarioDinamico) nomeUsuarioDinamico.textContent = nomeUsuario;
    // Atualiza também nas publicações
    for (let i = 1; i <= 3; i++) {
        const nomePub = document.getElementById('nomePub-' + i);
        if (nomePub) nomePub.textContent = nomeUsuario;
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Busca a foto salva no localStorage (ou backend, se for o caso)
    const fotoUsuario = localStorage.getItem('usuarioFoto'); // Corrigido para 'usuarioFoto'
    if (fotoUsuario) {
        // Atualiza a foto do perfil principal
        const fotoPerfil = document.getElementById('fotoPerfil');
        if (fotoPerfil) fotoPerfil.src = fotoUsuario;

        // Atualiza a foto das publicações (exemplo para 3 publicações)
        for (let i = 1; i <= 3; i++) {
            const fotoPub = document.getElementById('fotoPub-' + i);
            if (fotoPub) fotoPub.src = fotoUsuario;
        }
    }
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

function mostrarResposta(id, idx, rIdx = null, nivel = 0) {
    document.getElementById(`resposta-area-${id}-${idx}-${rIdx}-${nivel}`).style.display = 'block';
}

function cancelarResposta(id, idx, rIdx = null, nivel = 0) {
    document.getElementById(`resposta-area-${id}-${idx}-${rIdx}-${nivel}`).style.display = 'none';
    document.getElementById(`input-resposta-${id}-${idx}-${rIdx}-${nivel}`).value = '';
}

function enviarResposta(id, idx, rIdx = null, nivel = 0) {
    const input = document.getElementById(`input-resposta-${id}-${idx}-${rIdx}-${nivel}`);
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

        const form = document.getElementById('formCadastro');
        if (form) {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();
                const formData = new FormData(form);
                const nome = document.getElementById('nomeCompleto').value; // pega o nome digitado
                const resposta = await fetch('/api/usuarios', {
                    method: 'POST',
                    body: formData
                });
                if (resposta.ok) {
                    localStorage.setItem('usuarioNome', nome); // salva o nome no localStorage
                    window.location.href = 'index.html';
                } else {
                    alert('Erro ao cadastrar usuário!');
                }
            });
        }
    });
}

function abrirMenuComentario(id, idx, el) {
    // Fecha outros menus abertos
    document.querySelectorAll('.menu-comentario').forEach(m => m.style.display = 'none');
    // Abre o menu do comentário clicado
    const menu = document.getElementById(`menu-comentario-${id}-${idx}`);
    if (menu) menu.style.display = 'block';

    // Fecha ao clicar fora
    document.addEventListener('click', function fecharMenu(e) {
        if (!el.contains(e.target)) {
            menu.style.display = 'none';
            document.removeEventListener('click', fecharMenu);
        }
    });
}

function abrirMenuResposta(id, idxComentario, indicesStr, nivel, el) {
    // Fecha outros menus abertos
    document.querySelectorAll('.menu-comentario').forEach(m => m.style.display = 'none');
    // Garante que indicesStr é string com hífens
    const indicesStrSafe = Array.isArray(indicesStr) ? indicesStr.join('-') : String(indicesStr).replace(/,/g, '-');
    const menuId = `menu-resposta-${id}-${idxComentario}-${indicesStrSafe}-${nivel}`;
    const menu = document.getElementById(menuId);
    if (menu) menu.style.display = 'block';

    // Fecha ao clicar fora
    function fecharMenu(e) {
        if (!el.contains(e.target)) {
            menu.style.display = 'none';
            document.removeEventListener('click', fecharMenu);
        }
    }
    document.addEventListener('click', fecharMenu);
}

function toggleLike(id) {
    const likeIcon = document.getElementById('like-icon-' + id);
    const likeSpan = document.getElementById('like-' + id);
    const deslikeIcon = document.getElementById('deslike-icon-' + id);
    const deslikeSpan = document.getElementById('deslike-' + id);

    let liked = likeIcon.classList.contains('bi-hand-thumbs-up-fill');
    let desliked = deslikeIcon.classList.contains('bi-hand-thumbs-down-fill');

    if (liked) {
        likeIcon.classList.remove('bi-hand-thumbs-up-fill', 'text-success');
        likeIcon.classList.add('bi-hand-thumbs-up');
        likeSpan.textContent = Math.max(0, parseInt(likeSpan.textContent) - 1);
    } else {
        likeIcon.classList.remove('bi-hand-thumbs-up');
        likeIcon.classList.add('bi-hand-thumbs-up-fill', 'text-success');
        likeSpan.textContent = parseInt(likeSpan.textContent) + 1;
        if (desliked) {
            deslikeIcon.classList.remove('bi-hand-thumbs-down-fill', 'text-danger');
            deslikeIcon.classList.add('bi-hand-thumbs-down');
            deslikeSpan.textContent = Math.max(0, parseInt(deslikeSpan.textContent) - 1);
        }
    }
    atualizarContadorPerfil();
}

function toggleDeslike(id) {
    const deslikeIcon = document.getElementById('deslike-icon-' + id);
    const deslikeSpan = document.getElementById('deslike-' + id);
    const likeIcon = document.getElementById('like-icon-' + id);
    const likeSpan = document.getElementById('like-' + id);

    let desliked = deslikeIcon.classList.contains('bi-hand-thumbs-down-fill');
    let liked = likeIcon.classList.contains('bi-hand-thumbs-up-fill');

    if (desliked) {
        deslikeIcon.classList.remove('bi-hand-thumbs-down-fill', 'text-danger');
        deslikeIcon.classList.add('bi-hand-thumbs-down');
        deslikeSpan.textContent = Math.max(0, parseInt(deslikeSpan.textContent) - 1);
    } else {
        deslikeIcon.classList.remove('bi-hand-thumbs-down');
        deslikeIcon.classList.add('bi-hand-thumbs-down-fill', 'text-danger');
        deslikeSpan.textContent = parseInt(deslikeSpan.textContent) + 1;
        if (liked) {
            likeIcon.classList.remove('bi-hand-thumbs-up-fill', 'text-success');
            likeIcon.classList.add('bi-hand-thumbs-up');
            likeSpan.textContent = Math.max(0, parseInt(likeSpan.textContent) - 1);
        }
    }
    atualizarContadorPerfil();
}

function atualizarContadorPerfil() {
    // Soma todos os likes e deslikes dos cards
    let totalLikes = 0;
    let totalDeslikes = 0;
    for (let i = 1; i <= 3; i++) {
        const like = parseInt(document.getElementById('like-' + i).textContent) || 0;
        const deslike = parseInt(document.getElementById('deslike-' + i).textContent) || 0;
        totalLikes += like;
        totalDeslikes += deslike;
    }
    document.getElementById('curtidasPerfil').textContent = totalLikes;
    document.getElementById('deslikesPerfil').textContent = totalDeslikes;
}

function editarResposta(id, idxComentario, ...indices) {
    let respostas = comentariosPorPublicacao[id][idxComentario].respostas;
    // Navega até a resposta correta
    for (let i = 0; i < indices.length - 1; i++) {
        respostas = respostas[indices[i]].respostas;
    }
    let resposta = respostas[indices[indices.length - 1]];
    const novoTexto = prompt("Editar resposta:", resposta.texto);
    if (novoTexto !== null && novoTexto.trim() !== "") {
        resposta.texto = novoTexto.trim();
        renderizarComentarios(id);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Atualiza o nome do usuário dinâmico no perfil
    const nomeUsuario = localStorage.getItem('usuarioNome') || localStorage.getItem('usuarioLogado') || 'Usuário';
    const nomeUsuarioDinamico = document.getElementById('nomeUsuarioDinamico');
    if (nomeUsuarioDinamico) {
        nomeUsuarioDinamico.textContent = nomeUsuario;
    }
});

// Remove visualmente o campo telefone do cadastro.html via JS

document.addEventListener('DOMContentLoaded', function() {
    // Remove o campo telefone se existir
    var telefoneInput = document.querySelector('input[type="tel"], input[name*="tel"], input[name*="fone"], input[id*="tel"], input[id*="fone"]');
    if (telefoneInput) {
        var formGroup = telefoneInput.closest('.mb-3, .form-group, div');
        if (formGroup) formGroup.style.display = 'none';
        else telefoneInput.style.display = 'none';
    }
});

// Zera likes, deslikes e comentários visualmente ao carregar

document.addEventListener('DOMContentLoaded', function () {
    for (let i = 1; i <= 3; i++) {
        // Zera likes/deslikes visualmente
        const likeSpan = document.getElementById('like-' + i);
        const deslikeSpan = document.getElementById('deslike-' + i);
        if (likeSpan) likeSpan.textContent = '0';
        if (deslikeSpan) deslikeSpan.textContent = '0';
        // Zera comentários visualmente
        const listaComentarios = document.getElementById('lista-comentarios-' + i);
        if (listaComentarios) listaComentarios.innerHTML = '';
    }
});

// Desativa visualmente os botões de like/deslike ao carregar a página
// (Removido para reativar os botões)
// document.addEventListener('DOMContentLoaded', function () {
//     for (let i = 1; i <= 3; i++) {
//         const btnLike = document.getElementById('btn-like-' + i);
//         const btnDeslike = document.getElementById('btn-deslike-' + i);
//         if (btnLike) {
//             btnLike.style.pointerEvents = 'none';
//             btnLike.style.opacity = '0.5';
//             btnLike.title = 'Curtidas desativadas';
//         }
//         if (btnDeslike) {
//             btnDeslike.style.pointerEvents = 'none';
//             btnDeslike.style.opacity = '0.5';
//             btnDeslike.title = 'Deslikes desativados';
//         }
//     }
// });

// --- SEÇÃO DE COMENTÁRIOS UNIFICADA PARA AS TRÊS PUBLICAÇÕES ---

const comentariosPublicacoes = {
    1: [
        { usuario: 'Maria', texto: 'Adorei esse prato!' },
        { usuario: 'João', texto: 'Muito saboroso, recomendo.' }
    ],
    2: [
        { usuario: 'Ana', texto: 'Essa moqueca está linda!' },
        { usuario: 'Carlos', texto: 'Já comi, é maravilhosa.' }
    ],
    3: [
        { usuario: 'Bruna', texto: 'Feijoada top demais!' },
        { usuario: 'Pedro', texto: 'Clássico brasileiro, nota 10.' }
    ]
};

function renderizarComentariosPublicacao(id) {
    const lista = document.getElementById('lista-comentarios-' + id);
    if (!lista) return;
    lista.innerHTML = '';
    comentariosPublicacoes[id].forEach(comentario => {
        const div = document.createElement('div');
        div.className = 'comentario-item';
        div.innerHTML = `<b>${comentario.usuario}:</b> ${comentario.texto}`;
        lista.appendChild(div);
    });
}

function adicionarComentario(event, id) {
    event.preventDefault();
    const input = document.getElementById('input-comentario-' + id);
    const texto = input.value.trim();
    if (texto) {
        const usuario = localStorage.getItem('usuarioNome') || 'Você';
        comentariosPublicacoes[id].push({ usuario, texto });
        renderizarComentariosPublicacao(id);
        input.value = '';
    }
}

// Exibe/esconde comentários ao clicar no ícone
function toggleComentarios(id) {
    const area = document.getElementById('comentarios-abaixo-' + id);
    if (!area) return;
    if (area.style.display === 'none' || area.style.display === '') {
        renderizarComentariosPublicacao(id);
        area.style.display = 'block';
    } else {
        area.style.display = 'none';
    }
}

// Inicializa área de comentários oculta
for (let i = 1; i <= 3; i++) {
    document.addEventListener('DOMContentLoaded', function() {
        const area = document.getElementById('comentarios-abaixo-' + i);
        if (area) area.style.display = 'none';
    });
}
