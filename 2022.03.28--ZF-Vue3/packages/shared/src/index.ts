export const isObject = (obj) => typeof obj === 'object' && typeof obj !== null;
export const extend = Object.assign;
export const isArray = Array.isArray;
export const isFunction = (value) => typeof value == 'function';
export const isNumber = (value) => typeof value == 'number';
export const isString = (value) => typeof value == 'string';
export const isIntegerKey = (key) => parseInt(key) + '' === key;

let hasOwnProperty = Object.prototype.hasOwnProperty;
export const hasOwn = (target, key) => hasOwnProperty.call(target, key);

export const hasChanged = (oldValue, value) => oldValue !== value; 