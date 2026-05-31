"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nowIso = nowIso;
exports.toNumber = toNumber;
exports.getRideId = getRideId;
exports.imageOrFallback = imageOrFallback;
exports.fileOrEmpty = fileOrEmpty;
exports.isPdfFile = isPdfFile;
function nowIso() {
    return new Date().toISOString();
}
function toNumber(value, fallback = 0) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : fallback;
}
function getRideId(body) {
    const value = body?.rideId ??
        body?.id ??
        body?._id;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0
        ? parsed
        : null;
}
function imageOrFallback(value, fallback) {
    const text = String(value || '').trim();
    if (!text)
        return fallback;
    return text;
}
function fileOrEmpty(value) {
    const text = String(value || '').trim();
    if (!text)
        return '';
    return text;
}
function isPdfFile(value) {
    const text = String(value || '').toLowerCase();
    return (text.startsWith('data:application/pdf') ||
        text.includes('application/pdf') ||
        text.endsWith('.pdf'));
}
