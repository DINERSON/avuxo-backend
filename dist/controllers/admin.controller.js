"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPendingDrivers = listPendingDrivers;
exports.listAllDrivers = listAllDrivers;
exports.approveDriver = approveDriver;
exports.rejectDriver = rejectDriver;
exports.blockDriver = blockDriver;
exports.unblockDriver = unblockDriver;
const memory_store_1 = require("../storage/memory.store");
const driversDatabase = memory_store_1.memoryStore.driversDatabase;
function listPendingDrivers(_req, res) {
    const pendingDrivers = driversDatabase.filter((driver) => driver.status === 'pending' ||
        driver.approved === false);
    return res.json({
        success: true,
        total: pendingDrivers.length,
        drivers: pendingDrivers,
    });
}
function listAllDrivers(_req, res) {
    return res.json({
        success: true,
        total: driversDatabase.length,
        drivers: driversDatabase,
    });
}
function approveDriver(req, res) {
    const { id } = req.params;
    const driver = driversDatabase.find((item) => String(item.id) === String(id));
    if (!driver) {
        return res.status(404).json({
            success: false,
            message: 'Motorista não encontrado.',
        });
    }
    driver.status = 'approved';
    driver.approved = true;
    driver.blocked = false;
    driver.blockedReason = '';
    return res.json({
        success: true,
        message: 'Motorista aprovado com sucesso.',
        driver,
    });
}
function rejectDriver(req, res) {
    const { id } = req.params;
    const index = driversDatabase.findIndex((item) => String(item.id) === String(id));
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: 'Motorista não encontrado.',
        });
    }
    const driver = driversDatabase[index];
    driver.status = 'rejected';
    driver.approved = false;
    driver.online = false;
    driversDatabase.splice(index, 1);
    return res.json({
        success: true,
        message: 'Motorista rejeitado e removido do painel.',
        driver,
    });
}
function blockDriver(req, res) {
    const { id } = req.params;
    const driver = driversDatabase.find((item) => String(item.id) === String(id));
    if (!driver) {
        return res.status(404).json({
            success: false,
            message: 'Motorista não encontrado.',
        });
    }
    driver.status = 'blocked';
    driver.approved = false;
    driver.blocked = true;
    driver.online = false;
    driver.blockedReason =
        req.body.reason || 'Mensalidade pendente';
    return res.json({
        success: true,
        message: 'Motorista bloqueado.',
        driver,
    });
}
function unblockDriver(req, res) {
    const { id } = req.params;
    const driver = driversDatabase.find((item) => String(item.id) === String(id));
    if (!driver) {
        return res.status(404).json({
            success: false,
            message: 'Motorista não encontrado.',
        });
    }
    driver.status = 'pending';
    driver.approved = false;
    driver.blocked = false;
    driver.online = false;
    driver.blockedReason = '';
    return res.json({
        success: true,
        message: 'Motorista desbloqueado.',
        driver,
    });
}
