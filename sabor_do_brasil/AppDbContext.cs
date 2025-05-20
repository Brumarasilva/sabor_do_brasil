using Microsoft.EntityFrameworkCore;
using sabor_do_brasil.Models;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // Um DbSet para a tabela de usuários
    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Empresa> Empresas { get; set; }
    public DbSet<Categoria> Categorias { get; set; }
    public DbSet<Produto> Produtos { get; set; }
    public DbSet<Publicacao> Publicacoes { get; set; }
    public DbSet<Curtidas> Curtidas { get; set; }
    public DbSet<Comentarios> Comentarios { get; set; } 
}