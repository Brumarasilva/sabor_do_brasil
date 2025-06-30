using Microsoft.AspNetCore.Mvc;
using sabor_do_brasil.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Linq;

namespace sabor_do_brasil.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CadastroController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CadastroController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/cadastro
        [HttpPost]
        public async Task<IActionResult> PostUsuario([FromForm] Usuario usuario)
        {
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
                return BadRequest("E-mail já cadastrado.");

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok(usuario);
        }

        // PUT: api/cadastro/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, [FromForm] Usuario usuario)
        {
            var usuarioDb = await _context.Usuarios.FindAsync(id);
            if (usuarioDb == null) return NotFound();

            usuarioDb.Nome = usuario.Nome;
            usuarioDb.Email = usuario.Email;
            usuarioDb.Senha = usuario.Senha;
            usuarioDb.Foto = usuario.Foto;
            usuarioDb.Telefone = usuario.Telefone;
            await _context.SaveChangesAsync();
            return Ok(usuarioDb);
        }

        // DELETE: api/cadastro/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();
            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
