
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, query, where, serverTimestamp, orderBy, Timestamp, getCountFromServer } from 'firebase/firestore';
import type { ServiceRequest, ServiceRequestType } from '@/types';

// This is a type guard to ensure the service type is valid
function isValidServiceRequestType(type: any): type is ServiceRequestType {
  const validTypes: ServiceRequestType[] = [
    "castracao_animal", "corte_arvore_risco", "poda_arvore", 
    "plantio_arvore_area_publica", "coleta_especial_residuos", 
    "recolhimento_animal_errante_doente_ferido", "agendamento_uso_area_parque", 
    "solicitacao_adocao_animal", "licenca_ambiental_simplificada", 
    "solicitacao_projeto_educacao_ambiental", "outros_servicos_gerais"
  ];
  return validTypes.includes(type);
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

  try {
    const protocol = `SOL${Date.now().toString().slice(-6)}`;
    await addDoc(collection(db, 'service_requests'), {
      protocol: protocol,
      type: data.requestType,
      description: data.description,
      address: data.address || '',
      contactPhone: data.contactPhone || '',
      citizenId: data.citizenId,
      citizenName: data.citizenName,
      status: 'pendente',
      dateCreated: serverTimestamp(),
      dateUpdated: serverTimestamp(),
    });
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
            dateCreated: (data.dateCreated as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            dateUpdated: (data.dateUpdated as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            description: data.description,
            citizenName: data.citizenName,
            address: data.address,
            contactPhone: data.contactPhone,
        });
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
                dateCreated: (data.dateCreated as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
                dateUpdated: (data.dateUpdated as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
                description: data.description,
                citizenName: data.citizenName,
                address: data.address,
                contactPhone: data.contactPhone,
            };
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
