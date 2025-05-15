using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure; // Adicione este using

var builder = WebApplication.CreateBuilder(args);

// Configuração para MySQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

var app = builder.Build();
app.UseDefaultFiles(); // Serve index.html por padrão
app.UseStaticFiles(); // Permite servir arquivos da pasta wwwroot

app.MapGet("/index", async context =>
{
await context.Response.SendFileAsync("wwwroot/index.html");
});

app.MapPost("/login", async (AppDbContext db, Usuario login) =>
{
    var usuario = await db.Usuarios
        .FirstOrDefaultAsync(u => u.Email == login.Email && u.Senha == login.Senha);

    if (usuario == null)
        return Results.Unauthorized();

    return Results.Ok(new { usuario.Id, usuario.Email });
});

app.Run();
