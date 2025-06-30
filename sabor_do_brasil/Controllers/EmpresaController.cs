using Microsoft.AspNetCore.Mvc;
using sabor_do_brasil.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace sabor_do_brasil.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmpresaController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmpresaController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/empresa/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmpresa(int id)
        {
            var empresa = await _context.Empresas.FindAsync(id);
            if (empresa == null) return NotFound();
            return Ok(empresa);
        }
    }
}
