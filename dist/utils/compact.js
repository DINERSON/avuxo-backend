"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactDriver = compactDriver;
exports.compactRide = compactRide;
function compactDriver(driver) {
    return {
        id: driver.id,
        fullName: driver.fullName,
        email: driver.email,
        phone: driver.phone,
        carBrand: driver.carBrand,
        carModel: driver.carModel,
        carPlate: driver.carPlate,
        carColor: driver.carColor,
        carYear: driver.carYear,
        carSeats: driver.carSeats,
        renavam: driver.renavam,
        rentedVehicle: driver.rentedVehicle,
        approved: driver.approved,
        online: driver.online,
        blocked: driver.blocked,
        blockedReason: driver.blockedReason,
        createdAt: driver.createdAt,
        driverPhoto: driver.driverPhoto &&
            !String(driver.driverPhoto).startsWith('data:')
            ? driver.driverPhoto
            : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500',
        vehiclePhoto: driver.vehiclePhoto &&
            !String(driver.vehiclePhoto).startsWith('data:')
            ? driver.vehiclePhoto
            : 'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=700',
    };
}
function compactRide(ride) {
    return {
        id: ride.id,
        rideId: ride.rideId,
        status: ride.status,
        originName: ride.originName,
        destinationName: ride.destinationName,
        destinationLabel: ride.destinationLabel,
        price: ride.price,
        fare: ride.fare,
        total: ride.total,
        distanceText: ride.distanceText,
        eta: ride.eta,
        rideType: ride.rideType,
        createdAt: ride.createdAt,
        updatedAt: ride.updatedAt,
        driver: ride.driver
            ? {
                id: ride.driver.id,
                name: ride.driver.name,
                fullName: ride.driver.fullName,
                vehicle: ride.driver.vehicle,
                car: ride.driver.car,
                plate: ride.driver.plate,
                carPlate: ride.driver.carPlate,
            }
            : null,
    };
}
