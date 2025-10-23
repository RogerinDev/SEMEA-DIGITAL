
/**
 * @file next.config.ts
 * Arquivo de configuração para o Next.js.
 * Permite personalizar o comportamento do framework, como build,
 * roteamento, e recursos como otimização de imagens.
 */
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Configurações para o servidor de desenvolvimento.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // Em produção, restrinja isso!
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      },
    ];
  },
  // Configurações do TypeScript.
  typescript: {
    // Ignora erros de build do TypeScript. Útil em desenvolvimento,
    // mas deve ser usado com cautela em produção.
    ignoreBuildErrors: true,
  },
  // Configurações do ESLint.
  eslint: {
    // Ignora erros do ESLint durante o build.
    // Recomendado para acelerar o processo de build em ambientes que já
    // possuem um passo de lint separado (ex: CI/CD).
    ignoreDuringBuilds: true,
  },
  // Configuração para o componente <Image> do Next.js.
  images: {
    // Define uma lista de domínios permitidos para otimização de imagens.
    // Isso é uma medida de segurança para evitar o uso de imagens de fontes não confiáveis.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Domínio recomendado para imagens de placeholder.
        port: '',
        pathname: '/**', // Permite qualquer caminho dentro deste hostname.
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com', // Domínio do Firebase Storage
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
