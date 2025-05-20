using Microsoft.AspNetCore.Mvc;
using sabor_do_brasil.Models;

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
    public IActionResult Post([FromBody] Usuario usuario)
    {
        if (string.IsNullOrWhiteSpace(usuario.Nome) ||
            string.IsNullOrWhiteSpace(usuario.Email) ||
            string.IsNullOrWhiteSpace(usuario.Senha))
        {
            return BadRequest("Dados obrigatórios não preenchidos.");
        }

        _context.Usuarios.Add(usuario);
        _context.SaveChanges();
        return Ok();
    }
}