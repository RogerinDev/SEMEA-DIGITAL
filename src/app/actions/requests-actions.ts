
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, query, where, orderBy, getCountFromServer, updateDoc, Timestamp } from 'firebase/firestore';
import { SERVICE_REQUEST_TYPES, type ServiceRequest, type ServiceRequestType, type ServiceRequestStatus, type Department, type ServiceCategory } from '@/types';
import { revalidatePath } from 'next/cache';

const validServiceRequestTypes = SERVICE_REQUEST_TYPES.map(t => t.value);

// This is a type guard to ensure the service type is valid
function isValidServiceRequestType(type: any): type is ServiceRequestType {
  return validServiceRequestTypes.includes(type);
}

// Added for consistency and robustness, similar to incidents-actions
function mapServiceCategoryToDepartment(category: ServiceCategory): Department {
    return category;
}

interface NewRequestData {
  requestType: ServiceRequestType;
  description: string;
  address?: string;
  contactPhone?: string;
  citizenId: string;
  citizenName: string;
}

export async function addRequestAction(data: NewRequestData): Promise<{ success: boolean; protocol?: string; error?: string }> {
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
    const protocol = `SOL${Date.now().toString().slice(-6)}`;
    
    const newRequest = {
      protocol: protocol,
      type: data.requestType,
      description: data.description,
      department: department,
      address: data.address || "",
      contactPhone: data.contactPhone || "",
      citizenId: data.citizenId,
      citizenName: data.citizenName,
      status: 'pendente' as ServiceRequestStatus,
      dateCreated: new Date().toISOString(),
      dateUpdated: new Date().toISOString(),
      notes: "",
    };

    await addDoc(collection(db, 'service_requests'), newRequest);

    revalidatePath('/dashboard/citizen/requests');
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/citizen');
    revalidatePath('/dashboard/admin');

    return { success: true, protocol };
  } catch (error: any) {
    console.error("Error adding document: ", error);
    return { success: false, error: error.message };
  }
}

export async function getRequestsByCitizenAction(citizenId: string): Promise<ServiceRequest[]> {
  if (!citizenId) return [];

  try {
    const q = query(
        collection(db, "service_requests"), 
        where("citizenId", "==", citizenId),
        orderBy("dateCreated", "desc")
    );
    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
            id: doc.id,
            protocol: data.protocol,
            type: data.type,
            status: data.status,
            dateCreated: data.dateCreated,
            dateUpdated: data.dateUpdated,
            description: data.description,
            department: data.department,
            citizenName: data.citizenName,
            address: data.address,
            contactPhone: data.contactPhone,
        } as ServiceRequest);
    });
    return requests;
  } catch (error) {
    console.error("Error fetching requests: ", error);
    return [];
  }
}

export async function getRequestByIdAction(id: string): Promise<ServiceRequest | null> {
    if (!id) return null;
    try {
        const docRef = doc(db, 'service_requests', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                id: docSnap.id,
                protocol: data.protocol,
                type: data.type,
                status: data.status,
                dateCreated: data.dateCreated,
                dateUpdated: data.dateUpdated,
                description: data.description,
                department: data.department,
                citizenName: data.citizenName,
                address: data.address,
                contactPhone: data.contactPhone,
                notes: data.notes,
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

export async function getRequestCountByCitizenAction(citizenId: string): Promise<number> {
    if (!citizenId) return 0;
    try {
        const q = query(collection(db, "service_requests"), where("citizenId", "==", citizenId));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error getting request count: ", error);
        return 0;
    }
}


export async function getRequestsForAdminAction(department?: Department): Promise<ServiceRequest[]> {
  try {
    let q;
    const requestsCollection = collection(db, "service_requests");
    
    if (department) {
      q = query(requestsCollection, where("department", "==", department), orderBy("dateCreated", "desc"));
    } else {
      q = query(requestsCollection, orderBy("dateCreated", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const requests: ServiceRequest[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
            id: doc.id,
            protocol: data.protocol,
            type: data.type,
            status: data.status,
            dateCreated: data.dateCreated,
            dateUpdated: data.dateUpdated,
            description: data.description,
            department: data.department,
            citizenName: data.citizenName,
            address: data.address,
            contactPhone: data.contactPhone,
        } as ServiceRequest);
    });
    return requests;
  } catch (error) {
    console.error("Error fetching requests for admin: ", error);
    return [];
  }
}

export async function getRequestsCountAction({
  department,
  status,
  fromDate,
}: {
  department?: Department;
  status?: ServiceRequestStatus;
  fromDate?: Date;
}): Promise<number> {
  try {
    const queryConstraints: any[] = [];
    if (department) {
      queryConstraints.push(where("department", "==", department));
    }
    if (status) {
      queryConstraints.push(where("status", "==", status));
    }
    if (fromDate) {
      queryConstraints.push(where("dateCreated", ">=", fromDate.toISOString()));
    }

    const q = query(collection(db, "service_requests"), ...queryConstraints);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting request count for admin: ", error);
    return 0;
  }
}

interface UpdateRequestData {
    id: string;
    status: ServiceRequestStatus;
    notes?: string;
}

export async function updateRequestStatusAction(data: UpdateRequestData): Promise<{ success: boolean; error?: string }> {
  const { id, status, notes } = data;
  if (!id || !status) {
    return { success: false, error: "ID da solicitação e novo status são obrigatórios." };
  }

  try {
    const requestRef = doc(db, 'service_requests', id);
    await updateDoc(requestRef, {
      status: status,
      notes: notes ?? "",
      dateUpdated: new Date().toISOString(),
    });

    revalidatePath(`/dashboard/admin/requests/${id}`);
    revalidatePath(`/dashboard/citizen/requests/${id}`);
    revalidatePath('/dashboard/admin/requests');
    revalidatePath('/dashboard/citizen/requests');
    revalidatePath('/dashboard/admin');
    revalidatePath('/dashboard/citizen');


    return { success: true };
  } catch (error: any) {
    console.error("Error updating request status: ", error);
    return { success: false, error: "Não foi possível atualizar a solicitação." };
  }
}
