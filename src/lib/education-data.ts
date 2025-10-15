/**
 * @fileoverview Arquivo de dados estáticos para a seção de Educação Ambiental.
 * Centraliza as informações sobre projetos, palestras e eventos, facilitando a manutenção.
 */

import type { EducationalProject, ThematicLecture, EnvironmentalEvent } from '@/types';

// Lista de projetos educacionais oferecidos pela SEMEA.
export const educationalProjects: EducationalProject[] = [
  {
    id: '1',
    slug: 'escola-verde-educacao-climatica',
    title: 'ESCOLA VERDE - EDUCAÇÃO CLIMÁTICA',
    imageUrl: 'https://picsum.photos/seed/school-planting/600/400',
    dataAiHint: 'school children planting',
    introduction: 'Um projeto para destacar a importância das árvores e ampliar a arborização urbana, começando pelas escolas.',
    objectives: [
      'Destacar a importância das árvores na cidade.',
      'Resgatar a conexão com a natureza através da valorização dos espaços verdes arborizados.',
      'Ampliar a arborização da cidade dentro e fora das escolas, através do plantio planejado.',
    ],
    targetAudience: 'Educação infantil, Ensino Fundamental e Ensino Médio.',
    associatedLectures: [
      'A IMPORTÂNCIA DAS ÁRVORES',
      'PANORAMA AMBIENTAL DE VARGINHA',
    ],
    generalNote: true, // Indica que a nota geral da SEMEA deve ser exibida.
  },
  {
    id: '2',
    slug: 'educacao-lixo-zero',
    title: 'EDUCAÇÃO LIXO ZERO',
    imageUrl: 'https://picsum.photos/seed/recycling-bins/600/400',
    dataAiHint: 'recycling bins community',
    introduction: 'Capacitação sobre destinação correta de resíduos, consumo consciente e o conceito Lixo Zero.',
    objectives: [
      'Capacitar educadores, lideranças, gestores sobre a destinação correta de resíduos e o consumo consciente.',
      'Promover ações de conscientização sobre o descarte de resíduos, alinhado ao conceito “Lixo Zero”.',
    ],
    targetAudience: 'Educadores das redes pública e particular de ensino, lideranças comunitárias e empresariais.',
    associatedLectures: [
      'HISTÓRIA DO LIXO',
      'OS BICHOS E O LIXO',
      'O LIXO QUE É LUXO',
    ],
    generalNote: true,
  },
  {
    id: '3',
    slug: 'botanica-no-parque',
    title: 'BOTÂNICA NO PARQUE',
    imageUrl: 'https://picsum.photos/seed/nature-park/600/400',
    dataAiHint: 'students nature park',
    introduction: 'Aulas práticas de botânica nos parques da cidade para estimular a conexão com a natureza.',
    objectives: [
      'Realizar aulas práticas de botânica, através da visita ao Parques Novo Horizonte ou Centenário.',
      'Estimular a conexão com a natureza através da identificação de árvores.',
      'Valorizar os parques da cidade e seu patrimônio natural.',
    ],
    targetAudience: 'Ensino Fundamental e Ensino Médio.',
    methodology: [
      'Roteiro específico e adaptável a cada faixa etária, conduzido por Biólogo.',
      'Necessário agendamento prévio (ver seção "Como Participar").',
    ],
    duration: '2 horas (incluído intervalo para lanche).',
    observations: ['SEMEA não oferece transporte até os parques.'],
    generalNote: true,
  },
  {
    id: '4',
    slug: 'conexao-animal',
    title: 'CONEXÃO ANIMAL',
    imageUrl: 'https://picsum.photos/seed/pet-animal/600/400',
    dataAiHint: 'children pet animal',
    introduction: 'Promovendo o bem-estar animal, adoção responsável e coexistência com animais silvestres.',
    objectives: [
      'Estimular as boas práticas de bem estar animal, nos cuidados com animais de estimação.',
      'Estimular a adoção de animais do Abrigo Municipal.',
      'Conhecer os mecanismos de proteção animal.',
      'Reconhecer a presença de animais silvestres em áreas urbanas e aprender a lidar com potenciais conflitos.',
    ],
    targetAudience: 'Educação infantil, Ensino Fundamental e Ensino Médio; Educadores das redes pública e particular de ensino, lideranças comunitárias e empresariais.',
    associatedLectures: [
      'BICHOS DO MATO E DA MATA',
      'OS BICHOS E O LIXO',
      'COMO CUIDAR DOS ANIMAIS DE ESTIMAÇÃO',
      'BICHO QUE CHAMA BICHO (CONTAÇÃO DE ESTÓRIA)',
    ],
    generalNote: true,
  },
];

// Lista de palestras temáticas oferecidas.
export const thematicLectures: ThematicLecture[] = [
  // Palestras com foco nos Objetivos de Desenvolvimento Sustentável (ODS) da ONU.
  { id: 'ods6', title: 'ODS 6 - ÁGUA É VIDA', category: 'ODS' },
  { id: 'ods13', title: 'ODS 13 - O CLIMA MUDOU, E AGORA?', category: 'ODS' },
  { id: 'ods7', title: 'ODS 7 - ENERGIA LIMPA', category: 'ODS' },
  { id: 'ods14', title: 'ODS 14 - VIDA NA ÁGUA', category: 'ODS' },
  { id: 'ods11', title: 'ODS 11 - CIDADE SUSTENTÁVEL', category: 'ODS' },
  { id: 'ods15', title: 'ODS 15 - PLANETA TERRA', category: 'ODS' },
  { id: 'ods12', title: 'ODS 12 - CONSUMO CONSCIENTE', category: 'ODS' },
  { id: 'ods17', title: 'ODS 17 - PARCERIAS AMBIENTAIS', category: 'ODS' },
  // Palestras diretamente vinculadas aos projetos educacionais.
  { id: 'importancia_arvores', title: 'A IMPORTÂNCIA DAS ÁRVORES', category: 'Projetos' },
  { id: 'panorama_varginha', title: 'PANORAMA AMBIENTAL DE VARGINHA', category: 'Projetos' },
  { id: 'historia_lixo', title: 'HISTÓRIA DO LIXO', category: 'Projetos' },
  { id: 'bichos_lixo', title: 'OS BICHOS E O LIXO', category: 'Projetos' },
  { id: 'lixo_luxo', title: 'O LIXO QUE É LUXO', category: 'Projetos' },
  { id: 'bichos_mato_mata', title: 'BICHOS DO MATO E DA MATA', category: 'Projetos' },
  { id: 'cuidar_animais', title: 'COMO CUIDAR DOS ANIMAIS DE ESTIMAÇÃO', category: 'Projetos' },
  { id: 'bicho_chama_bicho', title: 'BICHO QUE CHAMA BICHO (CONTAÇÃO DE ESTÓRIA)', category: 'Projetos' },
];

// Lista de eventos ambientais (dados de exemplo).
export const environmentalEvents: EnvironmentalEvent[] = [
  { id: '1', name: 'Semana do Meio Ambiente 2024', type: 'feira_ambiental', date: new Date(2024, 5, 5, 9, 0).toISOString(), location: 'Praça Central de Varginha', description: 'Palestras, workshops e atividades educativas para todas as idades celebrando o meio ambiente.', imageUrl: 'https://picsum.photos/seed/env-fair/600/400', dataAiHint: 'environmental fair' },
  { id: '2', name: 'Workshop de Plantio de Hortas Urbanas', type: 'workshop', date: new Date(2024, 7, 12, 14, 0).toISOString(), location: 'Parque Novo Horizonte', description: 'Aprenda técnicas de cultivo de alimentos em pequenos espaços e contribua para uma cidade mais verde.', imageUrl: 'https://picsum.photos/seed/urban-garden/600/400', dataAiHint: 'urban gardening' },
  { id: '3', name: 'Trilha Ecológica Guiada no Parque São Francisco', type: 'trilha_guiada_ecologica', date: new Date(2024, 8, 3, 8, 0).toISOString(), location: 'Parque São Francisco', description: 'Explore a fauna e flora local com guias especializados. Inscrições limitadas.', imageUrl: 'https://picsum.photos/seed/nature-trail/600/400', dataAiHint: 'nature trail' },
  { id: '4', name: 'Dia da Árvore - Plantio Comunitário', type: 'palestra', date: new Date(2024, 8, 21, 9, 0).toISOString(), location: 'Parque Centenário', description: 'Celebre o Dia da Árvore participando de um plantio de mudas nativas.', imageUrl: 'https://picsum.photos/seed/tree-planting/600/400', dataAiHint: 'tree planting community' },
];
