# 🍃 SEMEA Digital - Varginha/MG

> Plataforma online de serviços, informações e portal de comunicação da Secretaria Municipal de Meio Ambiente de Varginha - MG. 

Este projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)**, com o objetivo de modernizar, centralizar e democratizar o acesso à informação ambiental para os cidadãos, além de fornecer um painel de gestão eficiente para os servidores públicos.

---

## ✨ Principais Funcionalidades

### 🏛️ Portal Público (Cidadão)
* **Páginas Setoriais Dinâmicas:** Informações detalhadas sobre Arborização Urbana, Educação Ambiental e Bem-Estar Animal.
* **Módulo de Resíduos Sólidos:** Sistema de busca integrada em tempo real para localizar Ecopontos por materiais aceitos e cronogramas de caminhão de coleta por bairro.
* **Portal de Notícias:** Feed de comunicados oficiais e novidades, com filtragem global na Home e filtragem específica dentro de cada página de setor.
* **Design Responsivo e Acessível:** Interface moderna adaptada para celulares, tablets e desktops.

### ⚙️ Painel Administrativo (Servidores)
* **Gestão de Conteúdo (CMS):** Edição em tempo real de textos, contatos, membros da equipe e serviços de cada setor.
* **RBAC (Role-Based Access Control):** Sistema rigoroso de permissões. 
  * *Super Admins* têm acesso total.
  * *Admins de Setor* só podem editar as páginas e publicar notícias referentes ao seu próprio departamento.
* **Blog Engine Integrada:** Criação e edição de notícias com suporte a imagens e links de vídeos externos (YouTube/Instagram) otimizados para performance.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna e de alta performance:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/) + Componentes UI (shadcn/ui)
* **Backend as a Service (BaaS):** [Firebase](https://firebase.google.com/)
  * *Firestore:* Banco de dados NoSQL para as configurações e notícias.
  * *Authentication:* Gerenciamento de usuários e controle de acesso.
  * *App Hosting:* Deploy e CI/CD.

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* Conta no Firebase com um projeto configurado (Firestore e Auth ativados)

### Passo a passo

1. **Clone o repositório:**
```bash
git clone [https://github.com/RogerinDev/SEMEA-DIGITAL.git](https://github.com/RogerinDev/SEMEA-DIGITAL.git)
