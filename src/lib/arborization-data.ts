import type { ArborizationProject } from '@/types';

export const arborizationProjects: ArborizationProject[] = [
  {
    id: '1',
    slug: 'plantar',
    title: 'Projeto PLANTAR',
    objective: 'O plantio de mudas de árvores nativas e exóticas com fins paisagísticos na arborização urbana de praças e vias públicas, em diferentes regiões da cidade onde a cobertura é mais escassa.',
    detailsPage: true,
  },
  {
    id: '2',
    slug: 'regenerar',
    title: 'Projeto REGENERAR',
    objective: 'Elaborar, implementar e estudar cientificamente projetos de restauração ecológica em áreas degradadas públicas utilizando um conjunto de técnicas regenerativas.',
    detailsPage: true,
  },
  {
    id: '3',
    slug: 'pomar-urbano',
    title: 'Projeto POMAR URBANO',
    objective: 'Realizar o plantio de mudas de árvores frutíferas em áreas públicas estratégicas na cidade, como cantos de ruas, escolas e creches, desde que não causem conflitos e seja propício ao convívio com a população.',
    detailsPage: true,
  },
  {
    id: '4',
    slug: 'cuidar',
    title: 'Projeto CUIDAR',
    objective: 'Executar ações de manejo da arborização urbana, como colocação e retirada de gradis, irrigação e podas de limpeza, condução e de risco. Inclui também o serviço de vistoria e emissão de autorização para poda e corte.',
    detailsPage: true,
  },
  {
    id: '5',
    slug: 'normatizar',
    title: 'Projeto NORMATIZAR',
    objective: 'Atualizar todas as normas ambientais municipais, elaborar instruções técnicas, termos de referência e propor novas leis para fortalecer a sustentabilidade em Varginha.',
    detailsPage: true,
  },
  {
    id: '6',
    slug: 'fito-inventariar',
    title: 'Projeto FITO-INVENTARIAR',
    objective: 'Catalogar as árvores de Varginha, formando um banco de dados geoespacializados com informações técnicas sobre a situação dos indivíduos arbóreos do ambiente urbano.',
    detailsPage: true,
  },
  {
    id: '7',
    slug: 'tele-arvore',
    title: 'Projeto TELE-ÁRVORE',
    objective: 'Criar um canal de aproximação da população com a arborização urbana, incentivando os moradores a terem uma árvore pública para chamar de sua.',
    howToParticipate: 'O munícipe pode solicitar o plantio de árvores na calçada do seu imóvel ou em áreas públicas por meio de mensagens via WhatsApp. Ele participa da escolha da espécie, do plantio e das ações de manejo.',
    cta: {
      text: 'Solicitar via WhatsApp',
      link: 'https://wa.me/553536902311?text=Olá!%20Gostaria%20de%20solicitar%20o%20plantio%20de%20uma%20árvore%20pelo%20Tele-Árvore.', // Placeholder number
      type: 'whatsapp'
    },
    detailsPage: true,
  },
  {
    id: '8',
    slug: 'nasce-uma-crianca-plante-uma-arvore',
    title: 'Projeto NASCE UMA CRIANÇA, PLANTE UMA ÁRVORE',
    objective: 'Fortalecer os vínculos da família e da criança com a natureza através do plantio de uma árvore em homenagem ao seu nascimento.',
    howToParticipate: 'O projeto é realizado em parceria com o Centro Ambulatorial de Especialidades da Criança, que realiza o cadastro das famílias interessadas. Cada bebê participante recebe um certificado de “amigo do meio-ambiente”.',
    cta: {
        text: 'Saiba como se cadastrar',
        link: '/info/urban-afforestation/contact', // Directs to contact page for more info
        type: 'info'
    },
    detailsPage: true,
  },
];
