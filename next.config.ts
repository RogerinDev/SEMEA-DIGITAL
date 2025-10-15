/**
 * @file next.config.ts
 * Arquivo de configuração para o Next.js.
 * Permite personalizar o comportamento do framework, como build,
 * roteamento, e recursos como otimização de imagens.
 */
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // Configurações de desenvolvimento para permitir requisições do Firebase Studio.
  experimental: {
    // Adiciona a origem do ambiente de desenvolvimento à lista de permissões.
    // Isso é necessário para que o servidor de desenvolvimento do Next.js aceite
    // requisições de dentro do ambiente do Firebase Studio.
    allowedDevOrigins: [
      "6000-firebase-studio-1748953010086.cluster-m7tpz3bmgjgoqrktlvd4ykrc2m.cloudworkstations.dev",
    ],
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
    ],
  },
};

export default nextConfig;
