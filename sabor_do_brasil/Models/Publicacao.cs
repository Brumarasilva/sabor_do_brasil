namespace sabor_do_brasil.Models
{
    public class Publicacao
    {
        public int Id { get; set; }
        public string TituloPublicacao { get; set; } = string.Empty;
        public string Conteudo { get; set; } = string.Empty;
        public DateTime DataPublicacao { get; set; }
        public string? TipoPublicacao { get; set; }
        public string? Imagem { get; set; }

        // Relação com Empresa (opcional)
        public int? IdEmpresa { get; set; }
        public Empresa? Empresa { get; set; }

        // Relação com Usuario
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}