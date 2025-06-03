export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t bg-background/80">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p>&copy; {currentYear} SEMEA Digital - Secretaria Municipal de Meio Ambiente de Varginha - MG.</p>
        <p>Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
