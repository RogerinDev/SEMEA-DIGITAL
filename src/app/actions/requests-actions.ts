/**
 * @fileoverview Server Actions para gerenciar a coleção de solicitações de serviço (`service_requests`).
 * Contém a lógica do lado do servidor para adicionar, buscar, contar e atualizar solicitações.
 * Cada função garante a obtenção de uma instância de DB segura antes de operar.
 */

'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { SERVICE_REQUEST_TYPES, type ServiceRequest, type ServiceRequestType, type ServiceRequestStatus, type Department, type ServiceCategory } from '@/types';
import { revalidatePath } from 'next/cache';
import type admin from 'firebase-admin';

// Array de tipos de serviço válidos para validação.
const validServiceRequestTypes = SERVICE_REQUEST_TYPES.map(t => t.value);

/**
 * Função de guarda (type guard) para validar se um valor é um tipo de serviço conhecido.
 * @param type O valor a ser verificado.
 * @returns `true` se o tipo for válido, `false` caso contrário.
 */
function isValidServiceRequestType(type: any): type is ServiceRequestType {
  return validServiceRequestTypes.includes(type);
}

/**
 * Mapeia uma categoria de serviço para o departamento responsável.
 * @param category A categoria do serviço.
 * @returns O departamento correspondente.
 */
function mapServiceCategoryToDepartment(category: ServiceCategory): Department {
    return category;
}

// Interface para os dados de uma nova solicitação.
interface NewRequestData {
  requestType: ServiceRequestType;
  description: string;
  address?: string;
  contactPhone?: string;
  citizenId: string;
  citizenName: string;
}

/**
 * Server Action para adicionar uma nova solicitação de serviço.
 * @param data Os dados da nova solicitação.
 * @returns Um objeto com status de sucesso, protocolo gerado ou mensagem de erro.
 */
export async function addRequestAction(data: NewRequestData): Promise<{ success: boolean; protocol?: string; error?: string }> {
  const { db } = getFirebaseAdmin();
  if (!isValidServiceRequestType(data.requestType)) {
    return { success: false, error: "Tipo de serviço inválido." };
  }
  if (!data.citizenId) {
    return { success: false, error: "Usuário não autenticado." };
  }

  const serviceTypeInfo = SERVICE_REQUEST_TYPES.find(t => t.value === data.requestType);
  if (!serviceTypeInfo) {
    return { success: false, error: "Categoria de serviço não encontrada." };
  }
  const department = mapServiceCategoryToDepartment(serviceTypeInfo.category);

  try {
    // Gera um protocolo único.
    const protocol = `SOL${Date.now().toString().slice(-6)}`;
    
    // Monta o objeto da nova solicitação.
    const newRequest: Omit<ServiceRequest, 'id'> = {
      protocol: protocol,
      type: data.requestType,
      description: data.description,
      department: department,
      address: data.address ?? "", 
      contactPhone: data.contactPhone ?? "", 
      citizenId: data.citizenId,
      citizenName: data.citizenName,
      status: 'pendente',
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      notes: "",
    };

    // Adiciona o documento ao Firestore.
    await db.collection('service_requests').add(newRequest);

    // Invalida o cache das páginas relevantes.
    revalidatePath('/dashboard/citizen/requests');
    revalidatePath('/dashboard/admin/requests');

    return { success: true, protocol };
  } catch (error: any) {
    console.error("Error adding document: ", error);
    return { success: false, error: "Não foi possível salvar a solicitação: " + error.message };
  }
}

/**
 * Server Action para buscar todas as solicitações de um cidadão específico.
 * @param citizenId O ID do cidadão (Firebase UID).
 * @returns Uma lista de solicitações.
 */
export async function getRequestsByCitizenAction(citizenId: string): Promise<ServiceRequest[]> {
  const { db } = getFirebaseAdmin();
  if (!citizenId) return [];

  try {
    const q = db.collection("service_requests")
        .where("citizenId", "==", citizenId)
        .orderBy("dateCreated", "desc");
    
    const querySnapshot = await q.get();
    const requests: ServiceRequest[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as ServiceRequest));
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    return [];
  }
}

/**
 * Server Action para buscar uma solicitação específica pelo seu ID de documento.
 * @param id O ID do documento no Firestore.
 * @returns A solicitação encontrada ou `null`.
 */
export async function getRequestByIdAction(id: string): Promise<ServiceRequest | null> {
    const { db } = getFirebaseAdmin();
    if (!id) return null;
    try {
        const docRef = db.collection('service_requests').doc(id);
        const docSnap = await docRef.get();

        if (docSnap.exists) {
            return {
                id: docSnap.id,
                ...docSnap.data(),
            } as ServiceRequest;
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching request by ID: ", error);
        return null;
    }
}

/**
 * Server Action para contar o número total de solicitações de um cidadão.
 * @param citizenId O ID do cidadão.
 * @returns O número de solicitações.
 */
export async function getRequestCountByCitizenAction(citizenId: string): Promise<number> {
    const { db } = getFirebaseAdmin();
    if (!citizenId) return 0;
    try {
        const q = db.collection("service_requests").where("citizenId", "==", citizenId);
        const snapshot = await q.count().get();
        return snapshot.data().count;
    } catch (error) {
        console.error("Error getting request count: ", error);
        return 0;
    }
}

/**
 * Server Action para buscar solicitações para a visão do administrador.
 * @param department - Opcional. Filtra as solicitações por departamento.
 * @returns Uma lista de solicitações para o painel administrativo.
 */
export async function getRequestsForAdminAction(department?: Department): Promise<ServiceRequest[]> {
  const { db } = getFirebaseAdmin();
  try {
    let q;
    const requestsCollection = db.collection("service_requests");
    
    if (department) {
      q = requestsCollection.where("department", "==", department).orderBy("dateCreated", "desc");
    } else {
      q = requestsCollection.orderBy("dateCreated", "desc");
    }

    const querySnapshot = await q.get();
    const requests: ServiceRequest[] = [];
    querySnapshot.forEach((doc) => {
        requests.push({
            id: doc.id,
            ...doc.data(),
        } as ServiceRequest);
    });
    return requests;
  } catch (error) {
    console.error("Error fetching requests for admin: ", error);
    return [];
  }
}

/**
 * Server Action para contar solicitações com base em filtros.
 * @param filters - Objeto com filtros opcionais (departamento, status, data).
 * @returns O número de solicitações que correspondem aos filtros.
 */
export async function getRequestsCountAction({
  department,
  status,
  fromDate,
}: {
  department?: Department;
  status?: ServiceRequestStatus;
  fromDate?: Date;
}): Promise<number> {
  const { db } = getFirebaseAdmin();
  try {
    let query: admin.firestore.Query<admin.firestore.DocumentData> = db.collection("service_requests");
    if (department) {
      query = query.where("department", "==", department);
    }
    if (status) {
      query = query.where("status", "==", status);
    }
    if (fromDate) {
      query = query.where("dateCreated", ">=", fromDate.toISOString());
    }

    const snapshot = await query.count().get();
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting request count for admin: ", error);
    return 0;
  }
}

// Interface para os dados de atualização de uma solicitação.
interface UpdateRequestData {
    id: string;
    status: ServiceRequestStatus;
    notes?: string;
}

/**
 * Server Action para atualizar o status e notas de uma solicitação.
 * @param data Os dados para atualização.
 * @returns Um objeto com status de sucesso ou mensagem de erro.
 */
export async function updateRequestStatusAction(data: UpdateRequestData): Promise<{ success: boolean; error?: string }> {
  const { db } = getFirebaseAdmin();
  const { id, status, notes } = data;
  if (!id || !status) {
    return { success: false, error: "ID da solicitação e novo status são obrigatórios." };
  }

  try {
    const requestRef = db.collection('service_requests').doc(id);
    await requestRef.update({
      status: status,
      notes: notes ?? "",
      dateUpdated: new Date().toISOString(),
    });

    // Invalida o cache das páginas relevantes.
    revalidatePath(`/dashboard/admin/requests/${id}`);
    revalidatePath(`/dashboard/citizen/requests/${id}`);
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/citizen/requests');

    return { success: true };
  } catch (error: any) {
    console.error("Error updating request status: ", error);
    return { success: false, error: "Não foi possível atualizar a solicitação." };
  }
}
