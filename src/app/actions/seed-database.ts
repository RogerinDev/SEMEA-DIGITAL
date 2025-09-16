/**
 * @fileoverview Server Action para popular o banco de dados com dados de exemplo.
 * Esta é uma ferramenta de desenvolvimento para testar a conexão com o Firestore
 * e fornecer dados iniciais para visualização.
 */
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';
import { collection, doc, writeBatch } from 'firebase/firestore';

// Função para gerar um protocolo único.
const generateProtocol = (prefix: string) => `${prefix}${Date.now().toString().slice(-6) + Math.floor(Math.random() * 100)}`;

/**
 * Server Action que insere dados de exemplo nas coleções do Firestore.
 * A função primeiro obtém uma instância segura do banco de dados antes de executar as operações.
 * @returns Um objeto indicando o sucesso ou falha da operação.
 */
export async function seedDatabaseAction(): Promise<{ success: boolean; message: string; error?: any }> {
  console.log('Iniciando a ação de semear o banco de dados...');
  const { db } = getFirebaseAdmin();
  const batch = writeBatch(db);

  try {
    // --- Dados de Exemplo para Solicitações de Serviço ---
    const requestsCollectionRef = collection(db, 'service_requests');
    const exampleRequests = [
      {
        protocol: generateProtocol('SOL'),
        type: 'poda_arvore',
        description: 'Galhos de árvore na Rua das Flores, 123, estão tocando a fiação elétrica e apresentam risco de queda em dias de vento. A árvore é um Ipê Amarelo.',
        department: 'arborizacao',
        address: 'Rua das Flores, 123, Centro',
        contactPhone: '(35) 99999-1111',
        citizenId: 'example-citizen-id-1',
        citizenName: 'João da Silva',
        status: 'pendente',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        notes: '',
      },
      {
        protocol: generateProtocol('SOL'),
        type: 'castracao_animal',
        description: 'Gostaria de agendar a castração para minha gata, chamada "Mimi". Ela tem aproximadamente 2 anos e é saudável.',
        department: 'bem_estar_animal',
        address: '',
        contactPhone: '(35) 98888-2222',
        citizenId: 'example-citizen-id-2',
        citizenName: 'Maria Oliveira',
        status: 'em_analise',
        dateCreated: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 dias atrás
        dateUpdated: new Date().toISOString(),
        notes: 'Verificar disponibilidade de agenda no centro de zoonoses.',
      },
    ];

    console.log(`Adicionando ${exampleRequests.length} solicitações de serviço de exemplo.`);
    exampleRequests.forEach(req => {
      const docRef = doc(requestsCollectionRef); // Cria uma referência com ID automático
      batch.set(docRef, req);
    });

    // --- Dados de Exemplo para Denúncias ---
    const incidentsCollectionRef = collection(db, 'incidents');
    const exampleIncidents = [
      {
        protocol: generateProtocol('DEN'),
        type: 'descarte_irregular_residuo',
        description: 'Um grande volume de entulho de construção e móveis velhos foi descartado em um terreno baldio na Avenida Brasil, próximo ao número 500.',
        location: 'Avenida Brasil, 500 (terreno baldio ao lado)',
        department: 'residuos',
        isAnonymous: false,
        citizenId: 'example-citizen-id-3',
        reportedBy: 'Carlos Souza',
        status: 'recebida',
        dateCreated: new Date().toISOString(),
        dateUpdated: new Date().toISOString(),
        notes: '',
        inspector: '',
      },
       {
        protocol: generateProtocol('DEN'),
        type: 'maus_tratos_animal',
        description: 'Cachorro mantido em corrente curta, sem água e comida aparentes, em uma casa na Rua dos Pinheiros. O animal parece muito magro e chora constantemente.',
        location: 'Rua dos Pinheiros, 789 (casa com portão azul)',
        department: 'bem_estar_animal',
        isAnonymous: true,
        citizenId: null,
        reportedBy: 'Anônimo',
        status: 'em_verificacao',
        dateCreated: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 dias atrás
        dateUpdated: new Date().toISOString(),
        notes: 'Fiscal João atribuído para verificação no local.',
        inspector: 'João',
      },
    ];
    
    console.log(`Adicionando ${exampleIncidents.length} denúncias de exemplo.`);
    exampleIncidents.forEach(inc => {
      const docRef = doc(incidentsCollectionRef);
      batch.set(docRef, inc);
    });

    // Executa todas as operações em lote
    await batch.commit();

    const successMessage = 'Banco de dados populado com sucesso! 2 solicitações e 2 denúncias de exemplo foram adicionadas.';
    console.log(successMessage);
    return { success: true, message: successMessage };

  } catch (error: any) {
    console.error('Erro ao popular o banco de dados:', error);
    // Este log de erro detalhado é crucial para a depuração
    console.error('Detalhes do Erro:', JSON.stringify(error, null, 2));
    return {
      success: false,
      message: 'Falha ao popular o banco de dados. Verifique os logs do servidor para mais detalhes.',
      error: error.message,
    };
  }
}
