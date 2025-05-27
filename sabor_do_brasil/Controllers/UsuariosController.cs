using Microsoft.AspNetCore.Mvc;
using sabor_do_brasil.Models;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/usuarios")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromForm] Usuario usuario, IFormFile Foto)
    {
        try
        {
            if (
                string.IsNullOrWhiteSpace(usuario.Nome) ||
                string.IsNullOrWhiteSpace(usuario.Email) ||
                string.IsNullOrWhiteSpace(usuario.Senha)
            )
            {
                return BadRequest("Dados obrigatórios não preenchidos.");
            }

            var usuarioExistente = _context.Usuarios.FirstOrDefault(u => u.Email == usuario.Email);
            if (usuarioExistente != null)
            {
                return Conflict("Já existe um usuário cadastrado com este e-mail.");
            }

            // Salvar a foto como base64 no banco
            if (Foto != null && Foto.Length > 0)
            {
                using (var ms = new MemoryStream())
                {
                    await Foto.CopyToAsync(ms);
                    var bytes = ms.ToArray();
                    usuario.Foto = "data:" + Foto.ContentType + ";base64," + Convert.ToBase64String(bytes);
                }
            }

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [HttpGet("{id}")]
    public IActionResult GetUsuario(int id)
    {
        var usuario = _context.Usuarios
            .Include(u => u.Curtidas)
            .FirstOrDefault(u => u.Id == id);

        if (usuario == null)
            return NotFound();

        return Ok(new {
            usuario.Nome,
            usuario.Foto,
            usuario.Email,
            Curtidas = usuario.Curtidas.Count
        });
    }
}