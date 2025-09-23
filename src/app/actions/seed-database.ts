
/**
 * @fileoverview Server Action para popular o banco de dados com dados de exemplo.
 * Esta é uma ferramenta de desenvolvimento para testar a conexão com o Firestore
 * e fornecer dados iniciais para visualização.
 */
'use server';

import { getFirebaseAdmin } from '@/lib/firebase/admin';

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
  const batch = db.batch();

  try {
    // --- Dados de Exemplo para Solicitações de Serviço ---
    const requestsCollectionRef = db.collection('service_requests');
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
      // --- DADOS PARA O DASHBOARD DE DESEMPENHO ---
       {
        protocol: 'SOLDAA4B',
        type: 'poda_arvore',
        description: 'Poda de árvore concluída na Rua dos Testes, 1.',
        department: 'arborizacao',
        citizenId: 'performance-test-user',
        citizenName: 'Usuário Teste Desempenho',
        status: 'concluido',
        dateCreated: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 dias atrás
        dateUpdated: new Date(Date.now() - 86400000 * 15).toISOString(), // Concluído no mesmo dia
        notes: 'Serviço de poda realizado com sucesso.',
      },
       {
        protocol: 'SOLDDC60',
        type: 'castracao_animal',
        description: 'Castração concluída para o animal "Rex".',
        department: 'bem_estar_animal',
        citizenId: 'performance-test-user-2',
        citizenName: 'Usuário Teste Desempenho 2',
        status: 'concluido',
        dateCreated: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 dias atrás
        dateUpdated: new Date(Date.now() - 86400000 * 8).toISOString(), // Concluído 2 dias depois
        notes: 'Cirurgia de castração realizada sem complicações.',
      }
    ];

    console.log(`Adicionando ${exampleRequests.length} solicitações de serviço de exemplo.`);
    exampleRequests.forEach(req => {
      const docRef = requestsCollectionRef.doc(); // Cria uma referência com ID automático
      batch.set(docRef, req);
    });

    // --- Dados de Exemplo para Denúncias ---
    const incidentsCollectionRef = db.collection('incidents');
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
      // --- DADOS PARA O DASHBOARD DE DESEMPENHO ---
       {
        protocol: 'DENA145B',
        type: 'descarte_irregular_residuo',
        description: 'Denúncia de descarte resolvida. Material recolhido.',
        location: 'Rua dos Testes, 2',
        department: 'residuos',
        isAnonymous: true,
        citizenId: null,
        reportedBy: 'Anônimo',
        status: 'resolvida',
        dateCreated: new Date(Date.now() - 86400000 * 20).toISOString(), // 20 dias atrás
        dateUpdated: new Date(Date.now() - 86400000 * 20).toISOString(), // Resolvido no mesmo dia
        notes: 'Equipe de limpeza removeu o entulho.',
        inspector: 'Equipe Limpeza',
      },
      {
        protocol: 'DEN1FDB7',
        type: 'maus_tratos_animal',
        description: 'Animal resgatado e encaminhado para abrigo.',
        location: 'Rua dos Testes, 3',
        department: 'bem_estar_animal',
        isAnonymous: false,
        citizenId: 'performance-test-user-3',
        reportedBy: 'Usuário Teste Desempenho 3',
        status: 'resolvida',
        dateCreated: new Date(Date.now() - 86400000 * 8).toISOString(), // 8 dias atrás
        dateUpdated: new Date(Date.now() - 86400000 * 3).toISOString(), // Resolvido 5 dias depois
        notes: 'Animal recebeu cuidados veterinários e está para adoção.',
        inspector: 'Fiscal Ana',
      },
    ];
    
    console.log(`Adicionando ${exampleIncidents.length} denúncias de exemplo.`);
    exampleIncidents.forEach(inc => {
      const docRef = incidentsCollectionRef.doc();
      batch.set(docRef, inc);
    });

    // Executa todas as operações em lote
    await batch.commit();

    const successMessage = 'Banco de dados populado com sucesso! 4 solicitações e 4 denúncias de exemplo foram adicionadas (incluindo dados concluídos para o dashboard).';
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
