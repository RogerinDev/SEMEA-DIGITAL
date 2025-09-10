/**
 * @fileoverview Componente de rodapé padrão para a aplicação.
 * Exibe informações de copyright e créditos.
 */

export function Footer() {
  const currentYear = new Date().getFullYear(); // Pega o ano atual dinamicamente.
  return (
    <footer className="border-t bg-background/80">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} SEMEA Digital - Centro Federal de Educação Tecnológica de Minas Gerais - Campus Varginha.</p>
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
