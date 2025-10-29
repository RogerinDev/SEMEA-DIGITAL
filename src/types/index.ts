/**
 * @fileoverview Arquivo central de definições de tipos (TypeScript) para toda a aplicação.
 * Isso garante consistência e reuso de tipos em diferentes partes do código.
 */

import type { User as FirebaseUser } from 'firebase/auth';

// Define os papéis de usuário possíveis no sistema.
export type UserRole = 'citizen' | 'admin' | 'superAdmin';

// Estende o tipo de usuário do Firebase para incluir nossos campos customizados.
export interface AppUser extends FirebaseUser {
  role?: UserRole; // Papel do usuário (vindo dos Custom Claims).
  department?: Department; // Departamento do usuário (vindo dos Custom Claims).
}

// Define os departamentos da secretaria.
export type Department = 'arborizacao' | 'residuos' | 'bem_estar_animal' | 'educacao_ambiental' | 'gabinete';

// Define a estrutura para uma entrada no histórico de status.
export interface StatusHistoryEntry {
  status: ServiceRequestStatus | IncidentStatus;
  date: string; // ISO string date
  updatedBy: string; // Nome do usuário que fez a atualização
  notes?: string;
}

// Define os status possíveis para uma solicitação de serviço.
export type ServiceRequestStatus = "pendente" | "em_analise" | "vistoria_agendada" | "aguardando_documentacao" | "aprovado" | "rejeitado" | "concluido" | "cancelado_pelo_usuario";

// Define os tipos de solicitação de serviço que um usuário pode fazer.
export type ServiceRequestType =
  | "castracao_animal"
  | "corte_arvore_risco"
  | "poda_arvore"
  | "plantio_arvore_area_publica"
  | "coleta_especial_residuos"
  | "recolhimento_animal_errante_doente_ferido"
  | "agendamento_uso_area_parque"
  | "solicitacao_adocao_animal"
  | "licenca_ambiental_simplificada"
  | "solicitacao_projeto_educacao_ambiental"
  | "agendamento_consulta_veterinaria"
  | "requerimento_corte_poda"
  | "registro_animal_perdido_encontrado" // NOVO TIPO
  | "outros_servicos_gerais";

// Estrutura de um documento de solicitação de serviço no Firestore.
export interface ServiceRequest {
  id: string; // ID do documento no Firestore.
  type: ServiceRequestType;
  protocol: string; // Protocolo gerado pelo sistema.
  status: ServiceRequestStatus;
  dateCreated: string; // Data de criação em formato ISO string.
  dateUpdated: string; // Data da última atualização em formato ISO string.
  description: string;
  department: Department;
  citizenId?: string; // UID do Firebase Auth do solicitante.
  citizenName?: string; 
  address?: string;
  contactPhone?: string;
  notes?: string; // Notas internas do administrador (PARECER TÉCNICO).
  history: StatusHistoryEntry[];
}

// Define as categorias de serviço, que agrupam os tipos de serviço.
export type ServiceCategory = 'arborizacao' | 'residuos' | 'bem_estar_animal' | 'educacao_ambiental';

// Estrutura para descrever um tipo de solicitação de serviço.
export interface ServiceRequestTypeInfo {
  value: ServiceRequestType;
  label: string;
  category: ServiceCategory;
}

// Lista mestre de todos os tipos de solicitação de serviço.
export const SERVICE_REQUEST_TYPES: ServiceRequestTypeInfo[] = [
  // Arborização
  { value: "poda_arvore", label: "Poda de Árvore", category: 'arborizacao' },
  { value: "corte_arvore_risco", label: "Corte de Árvore em Risco", category: 'arborizacao' },
  { value: "plantio_arvore_area_publica", label: "Plantio de Árvore em Área Pública", category: 'arborizacao' },
  { value: "requerimento_corte_poda", label: "Requerimento de Corte/Poda de Árvore", category: 'arborizacao' },
  { value: "licenca_ambiental_simplificada", label: "Licença Ambiental Simplificada", category: 'arborizacao' },

  // Resíduos
  { value: "coleta_especial_residuos", label: "Coleta Especial de Resíduos", category: 'residuos' },

  // Bem-Estar Animal
  { value: "castracao_animal", label: "Castração de Animal", category: 'bem_estar_animal' },
  { value: "recolhimento_animal_errante_doente_ferido", label: "Recolhimento de Animal Errante/Doente/Ferido", category: 'bem_estar_animal' },
  { value: "solicitacao_adocao_animal", label: "Solicitação de Adoção de Animal", category: 'bem_estar_animal' },
  { value: "agendamento_consulta_veterinaria", label: "Agendamento de Consulta Veterinária", category: 'bem_estar_animal' },
  { value: "registro_animal_perdido_encontrado", label: "Registro de Animal Perdido ou Encontrado", category: 'bem_estar_animal' },

  // Educação Ambiental & Outros
  { value: "solicitacao_projeto_educacao_ambiental", label: "Solicitação de Projeto/Palestra de Educação Ambiental", category: 'educacao_ambiental' },
  { value: "agendamento_uso_area_parque", label: "Agendamento de Uso de Área em Parque", category: 'educacao_ambiental' },
  { value: "outros_servicos_gerais", label: "Outros Serviços Gerais", category: 'educacao_ambiental' },
];


// Define as categorias de denúncia ambiental.
export type IncidentCategory = 'residuos_poluicao' | 'animais' | 'flora_areas_protegidas' | 'outras';

// Define os status possíveis para uma denúncia.
export type IncidentStatus = "recebida" | "em_verificacao" | "fiscalizacao_agendada" | "em_andamento_fiscalizacao" | "auto_infracao_emitido" | "medida_corretiva_solicitada" | "resolvida" | "arquivada_improcedente";

// Define os tipos de denúncia que um usuário pode fazer.
export type IncidentType =
  | "descarte_irregular_residuo"
  | "maus_tratos_animal"
  | "desmatamento_ilegal"
  | "poluicao_sonora"
  | "poluicao_agua_solo_ar"
  | "queimada_ilegal"
  | "invasao_area_protegida"
  | "animal_silvestre_risco_resgate"
  | "problema_parque_municipal"
  | "arvore_doente_risco_nao_solicitado_corte"
  | "outra_infracao_ambiental";

// Estrutura de um documento de denúncia no Firestore.
export interface IncidentReport {
  id: string;
  type: IncidentType;
  protocol: string;
  status: IncidentStatus;
  dateCreated: string;
  dateUpdated?: string;
  description: string;
  location: string;
  department: Department;
  citizenId?: string | null;
  reportedBy?: string;
  isAnonymous?: boolean;
  notes?: string; // Notas internas do administrador/fiscal.
  inspector?: string; // Nome do fiscal responsável.
  evidenceUrls?: string[]; // URLs das fotos/vídeos.
  history: StatusHistoryEntry[];
}

// Estrutura para descrever um tipo de denúncia.
export interface IncidentTypeInfo {
  value: IncidentType;
  label: string;
  category: IncidentCategory;
}

// Lista mestre de todos os tipos de denúncia.
export const INCIDENT_TYPES: IncidentTypeInfo[] = [
    { value: "descarte_irregular_residuo", label: "Descarte Irregular de Resíduo", category: 'residuos_poluicao' },
    { value: "poluicao_sonora", label: "Poluição Sonora", category: 'residuos_poluicao' },
    { value: "poluicao_agua_solo_ar", label: "Poluição da Água/Solo/Ar", category: 'residuos_poluicao' },
    { value: "maus_tratos_animal", label: "Maus Tratos a Animal", category: 'animais' },
    { value: "animal_silvestre_risco_resgate", label: "Animal Silvestre em Risco/Resgate", category: 'animais' },
    { value: "desmatamento_ilegal", label: "Desmatamento Ilegal", category: 'flora_areas_protegidas' },
    { value: "queimada_ilegal", label: "Queimada Ilegal", category: 'flora_areas_protegidas' },
    { value: "invasao_area_protegida", label: "Invasão de Área Protegida", category: 'flora_areas_protegidas' },
    { value: "arvore_doente_risco_nao_solicitado_corte", label: "Árvore Doente/Risco (Não Solicitado Corte)", category: 'flora_areas_protegidas' },
    { value: "problema_parque_municipal", label: "Problema em Parque Municipal", category: 'outras' },
    { value: "outra_infracao_ambiental", label: "Outra Infração Ambiental", category: 'outras' },
];


// ---- Tipos para a Seção de Bem-Estar Animal ----

// Status de um animal no processo de adoção.
export type AdoptionStatus = "disponivel" | "processo_adocao_em_andamento" | "adotado";
// Espécies de animais para adoção.
export type AnimalSpecies = "cao" | "gato" | "outro";

// Estrutura de um documento de animal para adoção.
export interface AnimalForAdoption {
  id: string;
  name: string;
  species: AnimalSpecies;
  breed: string;
  age: string;
  photoUrl: string; // URL da imagem no Firebase Storage.
  description: string;
  status: AdoptionStatus;
  dateAdded: string;
}

// Status de um post de animal perdido ou achado
export type LostFoundStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'concluido';

// Estrutura de um documento de animal perdido ou achado.
export interface LostFoundAnimal {
  id: string;
  type: 'perdido' | 'encontrado';
  species: string;
  breed?: string;
  description: string;
  lastSeenLocation: string;
  date: string; // Data do ocorrido.
  contactName: string;
  contactPhone: string;
  photoUrl: string;
  status: LostFoundStatus;
  citizenId: string;
  dateCreated: string;
  dateExpiration: string; // Data em que o post deixará de ser exibido.
}

// ---- Tipos para a Seção de Educação Ambiental ----

// Estrutura de um evento ambiental.
export interface EnvironmentalEvent {
    id:string;
    name: string;
    type: "palestra" | "workshop" | "curso_curta_duracao" | "trilha_guiada_ecologica" | "feira_ambiental";
    date: string;
    location: string;
    description: string;
    imageUrl?: string;
    dataAiHint?: string; // Dica para IA gerar imagens.
}

// Estrutura de um projeto educacional.
export interface EducationalProject {
  id: string;
  slug: string; // Identificador para URL.
  title: string;
  imageUrl: string;
  dataAiHint: string;
  introduction: string;
  objectives: string[];
  targetAudience: string;
  associatedLectures?: string[];
  methodology?: string[];
  duration?: string;
  observations?: string[];
  generalNote?: boolean;
}

// Estrutura de uma palestra temática.
export interface ThematicLecture {
  id: string;
  title: string;
  category?: string; // Ex: 'ODS', 'Projetos'.
  description?: string;
}

// ---- Tipos para a Seção de Arborização Urbana ----

// Estrutura de um projeto de arborização.
export interface ArborizationProject {
  id: string;
  slug: string;
  title: string;
  objective: string;
  howToParticipate?: string;
  cta?: { // Call to Action
    text: string;
    link: string;
    type: 'whatsapp' | 'internal' | 'external' | 'info';
  };
  detailsPage: boolean; // Se tem uma página de detalhes.
}


// ---- Tipos para IA (Genkit) ----

// Estrutura de um ticket resolvido, usado como base de conhecimento para a IA.
export type ResolvedTicket = {
  ticketId: string;
  description: string;
  resolution: string;
};


// ---- Tipos para o Dashboard de Desempenho ----

export interface PerformanceData {
  totalCompleted: number;
  avgResolutionTime: number;
  mostFrequentCategory: string;
  dailyTrend: { date: string; count: number }[];
  categoryDistribution: { name: string; value: number }[];
  departmentDistribution: { name: string; value: number }[];
}


// Constante com nota geral da SEMEA.
export const GENERAL_SEMEA_FOCUS_NOTE = "Além dos projetos específicos, a SEMEA foca em fomentar a destinação adequada de resíduos sólidos, prevenção a queimadas, preparo para emergência climática (proteção de APPs, áreas verdes, arborização urbana) e bem-estar animal.";