/**
 * @fileoverview Utilitário para envio de e-mails usando Nodemailer.
 * Configura um "transporter" para se conectar a um serviço SMTP (Gmail)
 * e fornece uma função para enviar notificações de atualização de status.
 */
'use server';

import nodemailer from 'nodemailer';

interface SendStatusNotificationParams {
  toEmail: string;
  citizenName: string;
  protocolId: string;
  newStatus: string;
  type: 'Solicitação' | 'Denúncia';
  notes?: string;
}

// Configuração do transporter do Nodemailer.
// As credenciais são lidas de variáveis de ambiente para segurança.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465', 10),
  secure: process.env.SMTP_SECURE === 'true' || true, // `true` para a porta 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Recomenda-se usar "Senhas de App" do Google
  },
});

/**
 * Gera o corpo HTML do e-mail de notificação.
 * @param params - Os dados para preencher o template.
 * @returns O corpo do e-mail em formato HTML.
 */
function createEmailHtml({ citizenName, protocolId, newStatus, type, notes }: SendStatusNotificationParams): string {
    const hasNotes = notes && notes.trim().length > 0;

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { font-family: 'PT Sans', sans-serif; margin: 0; padding: 0; background-color: #f0fff0; color: #2A402A; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #D1E7D1; border-radius: 8px; overflow: hidden; }
            .header { background-color: #248F24; color: #ffffff; padding: 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .content p { font-size: 16px; line-height: 1.6; }
            .protocol { background-color: #E6F5E6; padding: 10px 15px; border-radius: 6px; text-align: center; margin: 20px 0; }
            .protocol span { font-size: 18px; font-weight: bold; color: #248F24; }
            .status { text-transform: capitalize; font-weight: bold; }
            .notes { border-left: 4px solid #36A236; background-color: #f8f8f8; padding: 15px; margin-top: 20px; border-radius: 0 6px 6px 0; }
            .notes h3 { margin: 0 0 10px 0; font-size: 16px; color: #2A402A; }
            .footer { background-color: #f8f9fa; text-align: center; padding: 15px; font-size: 12px; color: #4D664D; border-top: 1px solid #D1E7D1; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Atualização SEMEA Digital</h1>
            </div>
            <div class="content">
                <p>Olá, ${citizenName},</p>
                <p>Sua <strong>${type}</strong> registrada no portal SEMEA Digital teve uma atualização de status.</p>
                <div class="protocol">
                    <span>Protocolo: ${protocolId}</span>
                </div>
                <p>O novo status da sua ${type.toLowerCase()} é: <strong class="status">${newStatus.replace(/_/g, ' ')}</strong></p>
                ${hasNotes ? `
                <div class="notes">
                    <h3>Parecer Técnico / Observações:</h3>
                    <p>${notes}</p>
                </div>
                ` : ''}
                <p>Você pode acompanhar todos os detalhes acessando o seu painel na plataforma.</p>
            </div>
            <div class="footer">
                <p>Prefeitura de Varginha - Secretaria Municipal de Meio Ambiente (SEMEA)</p>
                <p>Este é um e-mail automático. Por favor, não responda.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

/**
 * Envia um e-mail de notificação de atualização de status.
 * @param params - Os dados necessários para o envio do e-mail.
 */
export function sendStatusNotification(params: SendStatusNotificationParams) {
  // Verificação de segurança: não tenta enviar se as credenciais não estiverem configuradas.
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Variáveis de ambiente SMTP não configuradas. O envio de e-mail está desativado.');
    return;
  }

  const mailOptions = {
    from: `"SEMEA Digital" <${process.env.SMTP_USER}>`,
    to: params.toEmail,
    subject: `Atualização da sua ${params.type}: Protocolo #${params.protocolId}`,
    html: createEmailHtml(params),
  };

  // Envia o e-mail e lida com sucesso ou erro de forma assíncrona.
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Erro ao enviar e-mail de notificação para ${params.toEmail}:`, error);
    } else {
      console.log(`E-mail de notificação enviado para ${params.toEmail}. ID: ${info.messageId}`);
    }
  });
}
