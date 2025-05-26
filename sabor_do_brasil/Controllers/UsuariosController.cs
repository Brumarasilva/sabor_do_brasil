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
        if (string.IsNullOrWhiteSpace(usuario.Nome) ||
            string.IsNullOrWhiteSpace(usuario.Email) ||
            string.IsNullOrWhiteSpace(usuario.Senha))
        {
            return BadRequest("Dados obrigatórios não preenchidos.");
        }

        // Salvar a foto se enviada
        if (Foto != null && Foto.Length > 0)
        {
            var fileName = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(Foto.FileName);
            var filePath = Path.Combine("wwwroot/img", fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await Foto.CopyToAsync(stream);
            }

            usuario.Foto = "img/" + fileName;
        }

        _context.Usuarios.Add(usuario);
        await _context.SaveChangesAsync();
        return Ok();
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