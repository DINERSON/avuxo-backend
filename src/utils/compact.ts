import {
  DriverAccount,
  Ride,
} from '../types/app.types';

export function compactDriver(driver: DriverAccount) {
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

    driverPhoto: driver.driverPhoto || '',
    vehiclePhoto: driver.vehiclePhoto || '',
  };
}

export function compactRide(ride: Ride) {
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

    acceptedAt: ride.acceptedAt,
    arrivedAt: ride.arrivedAt,
    startedAt: ride.startedAt,
    finishedAt: ride.finishedAt,

    driver: ride.driver
      ? {
          id: ride.driver.id,
          name: ride.driver.name,
          fullName: ride.driver.fullName,

          vehicle: ride.driver.vehicle,
          car: ride.driver.car,

          plate: ride.driver.plate,
          carPlate: ride.driver.carPlate,

          driverPhoto: ride.driver.driverPhoto,
          vehiclePhoto: ride.driver.vehiclePhoto,

          rating: ride.driver.rating,

          lat: ride.driver.lat,
          lng: ride.driver.lng,
          latitude: ride.driver.latitude,
          longitude: ride.driver.longitude,

          eta: ride.driver.eta,
        }
      : null,
  };
}