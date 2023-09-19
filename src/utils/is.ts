export const isDenomXpla = (string = '') => string === 'axpla';

export const isDenomIBC = (string = '') => string.startsWith('ibc/');

export const isDenom = (string = '') =>
  isDenomXpla(string) || isDenomIBC(string);
