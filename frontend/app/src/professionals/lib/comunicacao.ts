// Utilitários de comunicação para WhatsApp e E-mail

export const gerarWhatsApp = (telefone: string, texto: string) => {
  const tel = telefone.replace(/\D/g, '');
  const url = `https://api.whatsapp.com/send?phone=55${tel}&text=${encodeURIComponent(texto)}`;
  window.open(url, '_blank');
};

export const gerarMailto = (email: string, assunto: string, corpo: string) => {
  const url = `mailto:${email}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
  window.open(url, '_blank');
};

export const substituirVariaveis = (
  template: string,
  variaveis: Record<string, string>
): string => {
  let resultado = template;
  Object.entries(variaveis).forEach(([chave, valor]) => {
    resultado = resultado.replace(new RegExp(`{{\\s*${chave}\\s*}}`, 'g'), valor);
  });
  return resultado;
};
