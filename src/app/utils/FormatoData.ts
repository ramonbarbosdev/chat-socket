export function formatarDataHora(stringDeDataInvalida: any): Date {
  const partes =
    typeof stringDeDataInvalida === 'string'
      ? stringDeDataInvalida.split(',').map(Number)
      : [];
  if (partes.length >= 7) {
    const ano = partes[0];
    const mes = partes[1] - 1; // JavaScript começa do 0
    const dia = partes[2];
    const hora = partes[3];
    const minuto = partes[4];
    const segundo = partes[5];
    const milissegundo = Math.floor(partes[6] / 1000000);
    return new Date(ano, mes, dia, hora, minuto, segundo, milissegundo);
  }
  return new Date();
}