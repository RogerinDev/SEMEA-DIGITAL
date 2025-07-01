
export type UserRole = 'citizen' | 'tecnico_ambiental' | 'fiscal_ambiental' | 'gestor_parques' | 'educador_ambiental' | 'agente_bem_estar_animal' | 'admin_secretaria';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type ServiceRequestStatus = "pendente" | "em_analise" | "vistoria_agendada" | "aguardando_documentacao" | "aprovado" | "rejeitado" | "concluido" | "cancelado_pelo_usuario";
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
  | "outros_servicos_gerais";

export interface ServiceRequest {
  id: string; // Firestore document ID
  type: ServiceRequestType;
  protocol: string;
  status: ServiceRequestStatus;
  dateCreated: string; // Store as ISO string for simplicity on client
  dateUpdated: string;
  description: string;
  citizenId?: string; // UID from Firebase Auth
  citizenName?: string; 
  address?: string;
  contactPhone?: string;
}

export type ServiceCategory = 'arborizacao' | 'residuos' | 'bem_estar_animal' | 'educacao_ambiental';

export interface ServiceRequestTypeInfo {
  value: ServiceRequestType;
  label: string;
  category: ServiceCategory;
}

export const SERVICE_REQUEST_TYPES: ServiceRequestTypeInfo[] = [
  // Arborização
  { value: "poda_arvore", label: "Poda de Árvore", category: 'arborizacao' },
  { value: "corte_arvore_risco", label: "Corte de Árvore em Risco", category: 'arborizacao' },
  { value: "plantio_arvore_area_publica", label: "Plantio de Árvore em Área Pública", category: 'arborizacao' },
  { value: "licenca_ambiental_simplificada", label: "Licença Ambiental Simplificada", category: 'arborizacao' },

  // Resíduos
  { value: "coleta_especial_residuos", label: "Coleta Especial de Resíduos", category: 'residuos' },

  // Bem-Estar Animal
  { value: "castracao_animal", label: "Castração de Animal", category: 'bem_estar_animal' },
  { value: "recolhimento_animal_errante_doente_ferido", label: "Recolhimento de Animal Errante/Doente/Ferido", category: 'bem_estar_animal' },
  { value: "solicitacao_adocao_animal", label: "Solicitação de Adoção de Animal", category: 'bem_estar_animal' },

  // Educação Ambiental & Outros
  { value: "solicitacao_projeto_educacao_ambiental", label: "Solicitação de Projeto/Palestra de Educação Ambiental", category: 'educacao_ambiental' },
  { value: "agendamento_uso_area_parque", label: "Agendamento de Uso de Área em Parque", category: 'educacao_ambiental' },
  { value: "outros_servicos_gerais", label: "Outros Serviços Gerais", category: 'educacao_ambiental' },
];


export type IncidentStatus = "recebida" | "em_verificacao" | "fiscalizacao_agendada" | "em_andamento_fiscalizacao" | "auto_infracao_emitido" | "medida_corretiva_solicitada" | "resolvida" | "arquivada_improcedente";
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

export interface IncidentReport {
  id: string; // Firestore document ID
  type: IncidentType;
  protocol: string;
  status: IncidentStatus;
  dateCreated: string; // Store as ISO string
  description: string;
  location: string;
  citizenId?: string; // UID from Firebase Auth
  reportedBy?: string; // Optional, can be anonymous
  isAnonymous?: boolean;
}

export const INCIDENT_TYPES: { value: IncidentType, label: string }[] = [
    { value: "descarte_irregular_residuo", label: "Descarte Irregular de Resíduo" },
    { value: "maus_tratos_animal", label: "Maus Tratos a Animal" },
    { value: "desmatamento_ilegal", label: "Desmatamento Ilegal" },
    { value: "poluicao_sonora", label: "Poluição Sonora" },
    { value: "poluicao_agua_solo_ar", label: "Poluição da Água/Solo/Ar" },
    { value: "queimada_ilegal", label: "Queimada Ilegal" },
    { value: "invasao_area_protegida", label: "Invasão de Área Protegida" },
    { value: "animal_silvestre_risco_resgate", label: "Animal Silvestre em Risco/Resgate" },
    { value: "problema_parque_municipal", label: "Problema em Parque Municipal" },
    { value: "arvore_doente_risco_nao_solicitado_corte", label: "Árvore Doente/Risco (Não Solicitado Corte)" },
    { value: "outra_infracao_ambiental", label: "Outra Infração Ambiental" },
];


export interface Animal {
  id: string;
  name: string;
  species: "cao" | "gato" | "outro";
  breed: string;
  age: string;
  photoUrl: string;
  description: string;
  statusAdocao: "disponivel" | "processo_adocao_em_andamento" | "adotado";
}

export interface LostFoundAnimal {
  id: string; // Firestore document ID
  type: 'perdido' | 'encontrado';
  species: string;
  breed?: string;
  description: string;
  lastSeenLocation: string;
  date: string; // ISO string for the event date
  contactName: string;
  contactPhone: string;
  photoUrl: string; // URL from Firebase Storage
  status: 'ativo' | 'resolvido';
  citizenId: string; // UID from Firebase Auth
  dateCreated: string; // ISO String - Firestore server timestamp
  dateExpiration: string; // ISO String - Firestore server timestamp
}

export interface EnvironmentalEvent {
    id:string;
    name: string;
    type: "palestra" | "workshop" | "curso_curta_duracao" | "trilha_guiada_ecologica" | "feira_ambiental";
    date: string; // Store as ISO string
    location: string;
    description: string;
    imageUrl?: string;
    dataAiHint?: string;
}

// For GenAI
export type ResolvedTicket = {
  ticketId: string;
  description: string;
  resolution: string;
};

// Types for Environmental Education Section
export interface EducationalProject {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  dataAiHint: string;
  introduction: string; // Short description for listing page
  objectives: string[];
  targetAudience: string;
  associatedLectures?: string[];
  methodology?: string[];
  duration?: string;
  observations?: string[];
  generalNote?: boolean; // To indicate if the general SEMEA focus note should be displayed
}

export interface ThematicLecture {
  id: string;
  title: string;
  category?: string; // e.g., ODS
  description?: string; // Optional brief description
}

export const GENERAL_SEMEA_FOCUS_NOTE = "Além dos projetos específicos, a SEMEA foca em fomentar a destinação adequada de resíduos sólidos, prevenção a queimadas, preparo para emergência climática (proteção de APPs, áreas verdes, arborização urbana) e bem-estar animal.";
