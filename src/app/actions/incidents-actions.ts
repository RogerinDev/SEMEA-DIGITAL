
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, getDoc, doc, query, where, serverTimestamp, orderBy, Timestamp, getCountFromServer, CollectionReference, updateDoc } from 'firebase/firestore';
import { INCIDENT_TYPES, type IncidentReport, type IncidentType, type IncidentCategory, type Department, type IncidentStatus } from '@/types';

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
            return 'educacao_ambiental';
    }
}

interface NewIncidentData {
  incidentType: IncidentType;
  description: string;
  location: string;
  isAnonymous: boolean;
  citizenId: string;
  citizenName: string;
}

export async function addIncidentAction(data: NewIncidentData): Promise<{ success: boolean; protocol?: string; error?: string }> {
  if (!isValidIncidentType(data.incidentType)) {
    return { success: false, error: "Tipo de denúncia inválido." };
  }

  const incidentTypeInfo = INCIDENT_TYPES.find(t => t.value === data.incidentType);
  if (!incidentTypeInfo) {
      return { success: false, error: "Categoria de denúncia não encontrada." };
  }
  const department = mapIncidentCategoryToDepartment(incidentTypeInfo.category);

  try {
    const protocol = `DEN${Date.now().toString().slice(-6)}`;
    
    const newIncident = {
      protocol,
      type: data.incidentType,
      description: data.description,
      location: data.location,
      department: department,
      isAnonymous: data.isAnonymous,
      citizenId: data.isAnonymous ? null : (data.citizenId || null),
      reportedBy: data.isAnonymous ? 'Anônimo' : (data.citizenName || 'Cidadão'),
      status: 'recebida' as IncidentStatus,
      dateCreated: serverTimestamp(),
      dateUpdated: serverTimestamp(),
    };

    await addDoc(collection(db, 'incidents'), newIncident);
    return { success: true, protocol };
  } catch (error: any) {
    console.error("Error adding incident: ", error);
    return { success: false, error: error.message };
  }
}

export async function getIncidentsByCitizenAction(citizenId: string): Promise<IncidentReport[]> {
  if (!citizenId) return [];

  try {
    const q = query(
        collection(db, "incidents"), 
        where("citizenId", "==", citizenId),
        orderBy("dateCreated", "desc")
    );
    const querySnapshot = await getDocs(q);
    const incidents: IncidentReport[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      incidents.push({
        id: doc.id,
        protocol: data.protocol,
        type: data.type,
        status: data.status,
        dateCreated: (data.dateCreated as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        description: data.description,
        location: data.location,
        department: data.department,
        reportedBy: data.reportedBy,
        isAnonymous: data.isAnonymous,
        citizenId: data.citizenId,
      });
    });
    return incidents;
  } catch (error) {
    console.error("Error fetching incidents: ", error);
    return [];
  }
}

export async function getIncidentByIdAction(id: string): Promise<IncidentReport | null> {
    if(!id) return null;
    try {
        const docRef = doc(db, 'incidents', id);
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
                location: data.location,
                department: data.department,
                reportedBy: data.reportedBy,
                isAnonymous: data.isAnonymous,
                citizenId: data.citizenId,
                notes: data.notes,
                inspector: data.inspector,
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

export async function getIncidentCountByCitizenAction(citizenId: string): Promise<number> {
    if (!citizenId) return 0;
    try {
        const q = query(collection(db, "incidents"), where("citizenId", "==", citizenId));
        const snapshot = await getCountFromServer(q);
        return snapshot.data().count;
    } catch (error) {
        console.error("Error getting incident count: ", error);
        return 0;
    }
}


export async function getIncidentsForAdminAction(department?: Department): Promise<IncidentReport[]> {
  try {
    let q;
    const incidentsCollection = collection(db, "incidents") as CollectionReference<IncidentReport>;

    if (department) {
      q = query(incidentsCollection, where("department", "==", department), orderBy("dateCreated", "desc"));
    } else {
      q = query(incidentsCollection, orderBy("dateCreated", "desc"));
    }

    const querySnapshot = await getDocs(q);
    const incidents: IncidentReport[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      incidents.push({
        id: doc.id,
        protocol: data.protocol,
        type: data.type,
        status: data.status,
        dateCreated: (data.dateCreated as any)?.toDate().toISOString() || new Date().toISOString(),
        description: data.description,
        location: data.location,
        department: data.department,
        reportedBy: data.reportedBy,
        isAnonymous: data.isAnonymous,
        citizenId: data.citizenId,
      });
    });
    return incidents;
  } catch (error) {
    console.error("Error fetching incidents for admin: ", error);
    return [];
  }
}

export async function getIncidentsCountAction({
  department,
  status,
}: {
  department?: Department;
  status?: IncidentStatus;
}): Promise<number> {
  try {
    const queryConstraints: any[] = [];
    if (department) {
      queryConstraints.push(where("department", "==", department));
    }
    if (status) {
      queryConstraints.push(where("status", "==", status));
    }

    const q = query(collection(db, "incidents"), ...queryConstraints);
    const snapshot = await getCountFromServer(q);
    return snapshot.data().count;
  } catch (error) {
    console.error("Error getting incident count for admin: ", error);
    return 0;
  }
}

interface UpdateIncidentData {
    id: string;
    status: IncidentStatus;
    notes?: string;
    inspector?: string;
}

export async function updateIncidentStatusAction(data: UpdateIncidentData): Promise<{ success: boolean; error?: string }> {
  const { id, status, notes, inspector } = data;
  if (!id || !status) {
    return { success: false, error: "ID da denúncia e novo status são obrigatórios." };
  }

  try {
    const incidentRef = doc(db, 'incidents', id);
    await updateDoc(incidentRef, {
      status,
      notes: notes || "",
      inspector: inspector || "",
      dateUpdated: serverTimestamp(),
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating incident status: ", error);
    return { success: false, error: "Não foi possível atualizar a denúncia." };
  }
}
