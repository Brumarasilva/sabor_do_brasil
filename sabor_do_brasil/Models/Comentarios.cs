namespace sabor_do_brasil.Models
{
    public class Comentarios
    {
        public int Id { get; set; }
        public string TextoComentario { get; set; } = string.Empty;
        public DateTime DataComentario { get; set; }

        // Relação com Usuario
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; } = null!;

        // Relação com Publicacao
        public int IdPublicacao { get; set; }
        public Publicacao Publicacao { get; set; } = null!;
    }
}