/**
 * @fileoverview Server Actions para gerenciar a coleção de denúncias (incidents) no Firestore.
 * Contém a lógica do lado do servidor para adicionar, buscar, contar e atualizar denúncias.
 * Cada função garante a obtenção de uma instância de DB segura antes de operar.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { INCIDENT_TYPES, type IncidentReport, type IncidentType, type IncidentCategory, type Department, type IncidentStatus } from '@/types';
import { revalidatePath } from 'next/cache';
import type admin from 'firebase-admin';

/**
 * Função de guarda (type guard) para validar se um valor é um tipo de denúncia conhecido.
 * @param type O valor a ser verificado.
 * @returns `true` se o tipo for válido, `false` caso contrário.
 */
function isValidIncidentType(type: any): type is IncidentType {
  const validTypes: IncidentType[] = [
    "descarte_irregular_residuo", "maus_tratos_animal", "desmatamento_ilegal", 
    "poluicao_sonora", "poluicao_agua_solo_ar", "queimada_ilegal", 
    "invasao_area_protegida", "animal_silvestre_risco_resgate", 
    "problema_parque_municipal", "arvore_doente_risco_nao_solicitado_corte", 
    "outra_infracao_ambiental"
  ];
  return validTypes.includes(type);
}

/**
 * Mapeia uma categoria de denúncia para o departamento responsável.
 * @param category A categoria da denúncia.
 * @returns O departamento correspondente.
 */
function mapIncidentCategoryToDepartment(category: IncidentCategory): Department {
    switch (category) {
        case 'residuos_poluicao':
            return 'residuos';
        case 'animais':
            return 'bem_estar_animal';
        case 'flora_areas_protegidas':
            return 'arborizacao';
        case 'outras':
            return 'educacao_ambiental';
        default:
            return 'educacao_ambiental'; // Departamento padrão para casos não mapeados.
    }
}

// Interface para os dados de uma nova denúncia.
interface NewIncidentData {
  incidentType: IncidentType;
  description: string;
  location: string;
  isAnonymous: boolean;
  citizenId: string;
  citizenName: string;
  evidenceUrls: string[];
}

/**
 * Server Action para adicionar uma nova denúncia.
 * @param data Os dados da nova denúncia.
 * @returns Um objeto com status de sucesso, protocolo gerado ou mensagem de erro.
 */
export async function addIncidentAction(data: NewIncidentData): Promise<{ success: boolean; protocol?: string; error?: string }> {
  const { db } = getFirebaseAdmin();
  if (!isValidIncidentType(data.incidentType)) {
    return { success: false, error: "Tipo de denúncia inválido." };
  }
  if (!data.citizenId && !data.isAnonymous) {
      return { success: false, error: "Usuário não autenticado."};
  }

  const incidentTypeInfo = INCIDENT_TYPES.find(t => t.value === data.incidentType);
  if (!incidentTypeInfo) {
      return { success: false, error: "Categoria de denúncia não encontrada." };
  }
  const department = mapIncidentCategoryToDepartment(incidentTypeInfo.category);

  try {
    // Gera um protocolo único baseado no timestamp.
    const protocol = `DEN${Date.now().toString().slice(-6)}`;
    
    // Monta o objeto da nova denúncia.
    const newIncident: Omit<IncidentReport, 'id'> = {
      protocol,
      type: data.incidentType,
      description: data.description,
      location: data.location,
      department: department,
      isAnonymous: data.isAnonymous ?? false,
      citizenId: data.isAnonymous ? null : data.citizenId,
      reportedBy: data.isAnonymous ? 'Anônimo' : data.citizenName,
      status: 'recebida',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      evidenceUrls: data.evidenceUrls,
      notes: "",
      inspector: "",
    };

    // Adiciona o documento ao Firestore.
    await db.collection('incidents').add(newIncident);
    
    // Invalida o cache das páginas relevantes para mostrar os dados atualizados.
    revalidatePath('/dashboard/citizen/incidents');
    revalidatePath('/dashboard/admin/incidents');
    
    return { success: true, protocol };
  } catch (error: any) {
    console.error("Error adding incident: ", error);
    return { success: false, error: "Não foi possível salvar a denúncia: " + error.message };
  }
}

/**
 * Server Action para buscar todas as denúncias de um cidadão específico.
 * @param citizenId O ID do cidadão (Firebase UID).
 * @returns Uma lista de denúncias.
 */
export async function getIncidentsByCitizenAction(citizenId: string): Promise<IncidentReport[]> {
    const { db } = getFirebaseAdmin();
    if (!citizenId) return [];

    try {
        const q = db.collection("incidents")
            .where("citizenId", "==", citizenId)
            .orderBy("dateCreated", "desc");
        
        const querySnapshot = await q.get();
        const incidents: IncidentReport[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                protocol: data.protocol,
                type: data.type,
                description: data.description,
                location: data.location,
                department: data.department,
                isAnonymous: data.isAnonymous,
                citizenId: data.citizenId,
                reportedBy: data.reportedBy,
                status: data.status,
                dateCreated: data.dateCreated,
                dateUpdated: data.dateUpdated,
                notes: data.notes,
                inspector: data.inspector,
                evidenceUrls: data.evidenceUrls || [],
            };
        });
        return incidents;
    } catch (error) {
        console.error("Error fetching incidents: ", error);
        return [];
    }
}

/**
 * Server Action para buscar uma denúncia específica pelo seu ID de documento.
 * @param id O ID do documento no Firestore.
 * @returns A denúncia encontrada ou `null` se não existir.
 */
export async function getIncidentByIdAction(id: string): Promise<IncidentReport | null> {
    const { db } = getFirebaseAdmin();
    if(!id) return null;
    try {
        const docRef = db.collection('incidents').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            const data = docSnap.data();
            if (!data) return null;
            return {
                id: docSnap.id,
                protocol: data.protocol,
                type: data.type,
                description: data.description,
                location: data.location,
                department: data.department,
                isAnonymous: data.isAnonymous,
                citizenId: data.citizenId,
                reportedBy: data.reportedBy,
                status: data.status,
                dateCreated: data.dateCreated,
                dateUpdated: data.dateUpdated,
                notes: data.notes,
                inspector: data.inspector,
                evidenceUrls: data.evidenceUrls || [],
            };
        } else {
            console.log("No such incident document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching incident by ID: ", error);
        return null;
    }
}

/**
 * Server Action para contar o número total de denúncias de um cidadão.
 * @param citizenId O ID do cidadão.
 * @returns O número de denúncias.
 */
export async function getIncidentCountByCitizenAction(citizenId: string): Promise<number> {
    const { db } = getFirebaseAdmin();
    if (!citizenId) return 0;
    try {
        const q = db.collection("incidents").where("citizenId", "==", citizenId);
        const snapshot = await q.count().get();
        return snapshot.data().count;
    } catch (error) {
        console.error("Error getting incident count: ", error);
        return 0;
    }
}


/**
 * Server Action para buscar denúncias para a visão do administrador.
 * @param department - Opcional. Filtra as denúncias por departamento.
 * @returns Uma lista de denúncias para o painel administrativo.
 */
export async function getIncidentsForAdminAction(department?: Department): Promise<IncidentReport[]> {
  const { db } = getFirebaseAdmin();
  try {
    let q;
    const incidentsCollection = db.collection("incidents");

    if (department) {
      q = incidentsCollection.where("department", "==", department).orderBy("dateCreated", "desc");
    } else {
      q = incidentsCollection.orderBy("dateCreated", "desc");
    }

    const querySnapshot = await q.get();
    const incidents: IncidentReport[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      incidents.push({
        id: doc.id,
        protocol: data.protocol,
        type: data.type,
        description: data.description,
        location: data.location,
        department: data.department,
        isAnonymous: data.isAnonymous,
        citizenId: data.citizenId,
        reportedBy: data.reportedBy,
        status: data.status,
        dateCreated: data.dateCreated,
        dateUpdated: data.dateUpdated,
        notes: data.notes,
        inspector: data.inspector,
        evidenceUrls: data.evidenceUrls || [],
      });
    });
    return incidents;
  } catch (error) {
    console.error("Error fetching incidents for admin: ", error);
    return [];
  }
}

/**
 * Server Action para contar denúncias com base em filtros (departamento, status).
 * @param filters - Objeto com filtros opcionais.
 * @returns O número de denúncias que correspondem aos filtros.
 */
export async function getIncidentsCountAction({
  department,
  status,
}: {
  department?: Department;
  status?: IncidentStatus;
}): Promise<number> {
  const { db } = getFirebaseAdmin();
  try {
    let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection("incidents");

    if (department) {
      query = query.where("department", "==", department);
    }
    if (status) {
      query = query.where("status", "==", status);
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting incident count for admin: ", error);
    return 0;
  }
}

// Interface para os dados de atualização de uma denúncia.
interface UpdateIncidentData {
    id: string;
    status: IncidentStatus;
    notes?: string;
    inspector?: string;
}

/**
 * Server Action para atualizar o status, notas e fiscal de uma denúncia.
 * @param data Os dados para atualização.
 * @returns Um objeto com status de sucesso ou mensagem de erro.
 */
export async function updateIncidentStatusAction(data: UpdateIncidentData): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  const { id, status, notes, inspector } = data;
  if (!id || !status) {
    return { success: false, error: "ID da denúncia e novo status são obrigatórios." };
  }

  try {
    const incidentRef = db.collection('incidents').doc(id);
    await incidentRef.update({
      status,
      notes: notes ?? "",
      inspector: inspector ?? "",
      dateUpdated: new Date().toISOString(),
    });
    
    // Invalida o cache de todas as páginas que exibem esta denúncia.
    revalidatePath(`/dashboard/admin/incidents/${id}`);
    revalidatePath(`/dashboard/citizen/incidents/${id}`);
    revalidatePath('/dashboard/admin/incidents');
    revalidatePath('/dashboard/citizen/incidents');

    return { success: true };
  } catch (error: any) {
    console.error("Error updating incident status: ", error);
    return { success: false, error: "Não foi possível atualizar a denúncia." };
  }
}
