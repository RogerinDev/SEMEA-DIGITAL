/**
 * @fileoverview Componente de rodapé padrão para a aplicação.
 * Exibe informações de copyright, links de navegação e detalhes de contato.
 */

import Link from 'next/link';
import { Instagram, Phone, MapPin, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background/80 text-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Coluna 1: Institucional e Redes Sociais */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-primary">Secretaria Municipal de Meio Ambiente - SEMEA</h3>
            <p className="text-sm text-muted-foreground">Prefeitura Municipal de Varginha</p>
            <div className="flex justify-center md:justify-start">
              <a href="https://www.instagram.com/semea.varginha/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>

          {/* Coluna 2: Navegação Rápida */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Navegação</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/info/sobre" className="text-muted-foreground hover:text-primary hover:underline">Sobre a SEMEA</Link></li>
              <li><a href="https://www.varginha.mg.gov.br/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary hover:underline">Portal da Prefeitura</a></li>
              <li><Link href="/animal-welfare/adoption" className="text-muted-foreground hover:text-primary hover:underline">Adoção Responsável</Link></li>
              <li><Link href="/animal-welfare/lost-found" className="text-muted-foreground hover:text-primary hover:underline">Animais Perdidos e Encontrados</Link></li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Atendimento */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fale Conosco</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>(35) 3690-2311</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-1" />
                <span>Rua Jaime Venturato, 50, São Geraldo. CEP: 37030-400, Varginha-MG.</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-2">
                <Clock className="h-4 w-4 shrink-0 mt-1" />
                <span>Seg. a Sex. das 07:30 às 11:30 e das 13:00 às 17:00.</span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-xs text-muted-foreground">
          <p>© {currentYear} SEMEA Digital - Centro Federal de Educação Tecnológica de Minas Gerais - Campus Varginha. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
