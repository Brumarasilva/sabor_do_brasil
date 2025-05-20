namespace sabor_do_brasil.Models
{
    public class Produto
    {
        public int Id { get; set; }
        public string NomeProduto { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public int QuantidadeEstoque { get; set; }

        // Relação com Categoria
        public int IdCategoria { get; set; }
        public Categoria Categoria { get; set; } = null!;

        // Relação com Empresa
        public int IdEmpresa { get; set; }
        public Empresa Empresa { get; set; } = null!;
    }
}