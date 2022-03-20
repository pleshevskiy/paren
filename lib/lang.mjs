export function isNil(v) {
    return v == null;
}
export function isBool(v) {
    return typeof v === "boolean";
}
export function isStr(v) {
    return typeof v === "string";
}
export function intoArr(v) {
    return Array.isArray(v) ? v : [v];
}
