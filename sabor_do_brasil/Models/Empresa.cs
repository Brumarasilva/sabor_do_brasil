namespace sabor_do_brasil.Models

{
    public class Empresa
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Cnpj { get; set; } = string.Empty;

        // Chave estrangeira para Usuario
        public int IdUsuario { get; set; }
        public Usuario Usuario { get; set; } = null!;
    }
}