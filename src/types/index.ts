
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
  // | "inscricao_evento_educacional" // Removed as it was tied to education
  | "solicitacao_adocao_animal"
  | "licenca_ambiental_simplificada"
  | "outros_servicos_gerais";

export interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  protocol: string;
  status: ServiceRequestStatus;
  dateCreated: string; // Store as ISO string for simplicity with mock data
  dateUpdated: string;
  description: string;
  citizenName?: string; // Optional for now
  address?: string; // Optional for now
}

export const SERVICE_REQUEST_TYPES: { value: ServiceRequestType, label: string }[] = [
  { value: "castracao_animal", label: "Castração de Animal" },
  { value: "corte_arvore_risco", label: "Corte de Árvore em Risco" },
  { value: "poda_arvore", label: "Poda de Árvore" },
  { value: "plantio_arvore_area_publica", label: "Plantio de Árvore em Área Pública" },
  { value: "coleta_especial_residuos", label: "Coleta Especial de Resíduos" },
  { value: "recolhimento_animal_errante_doente_ferido", label: "Recolhimento de Animal Errante/Doente/Ferido" },
  { value: "agendamento_uso_area_parque", label: "Agendamento de Uso de Área em Parque" },
  // { value: "inscricao_evento_educacional", label: "Inscrição em Evento Educacional" }, // Removed
  { value: "solicitacao_adocao_animal", label: "Solicitação de Adoção de Animal" },
  { value: "licenca_ambiental_simplificada", label: "Licença Ambiental Simplificada" },
  { value: "outros_servicos_gerais", label: "Outros Serviços Gerais" },
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
  id: string;
  type: IncidentType;
  protocol: string;
  status: IncidentStatus;
  dateCreated: string; // Store as ISO string
  description: string;
  location: string; 
  reportedBy?: string; // Optional, can be anonymous
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

// EducationalMaterial type removed as the education page is being removed.
// export interface EducationalMaterial {
//     id: string;
//     title: string;
//     type: "artigo_blog" | "pdf_cartilha" | "video_aula" | "podcast" | "link_externo" | "quiz_interativo";
//     description: string;
//     url: string;
//     imageUrl?: string;
//     dataAiHint?: string;
// }

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

    