namespace sabor_do_brasil.Models
{
    public class Usuario
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string? Foto { get; set; } // para base64
        public string? Telefone { get; set; } // adicionado para compatibilidade com o cadastro
        // Relação com Curtidas
        public ICollection<Curtidas> Curtidas { get; set; } = new List<Curtidas>();
    }
}