using Microsoft.EntityFrameworkCore;
// Ajuste o namespace se necessário

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Um DbSet para a tabela de usuários
    public DbSet<Usuario> Usuarios { get; set; }
}


