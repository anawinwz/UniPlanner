export const isNonEmpty = obj => Object.values(obj).some(value => (typeof value !== 'undefined' && typeof value !== 'object') || (typeof value === 'object' && isNonEmpty(value)));