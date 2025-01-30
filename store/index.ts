import { MarkerData } from "@/types/type";
import { create } from "zustand";
export const useLocationStore = create<any>((set) => ({
  userAddress: null,
  userLongitude: null,
  userLatitude: null,
  destAddress: null,
  destLongitude: null,
  destLatitude: null,
  setUserLocation: (
    userAddress: string,
    userLongitude: number,
    userLatitude: number,
  ) =>
    set(() => ({
      userAddress: userAddress,
      userLongitude: userLongitude,
      userLatitude: userLatitude,
    })),
  setDestLocation: (
    destAddress: string,
    destLongitude: number,
    destLatitude: number,
  ) =>
    set(() => ({
      destAddress: destAddress,
      destLongitude: destLongitude,
      destLatitude: destLatitude,
    })),
}));

export const useDriverStore = create<any>((set) => ({
  drivers: [],
  selectedDriver: null,
  setSelectedDriver: (driverId: number) =>
    set(() => ({ selectedDriver: driverId })),
  setDrivers: (drivers: MarkerData[]) => set(() => ({ drivers: drivers })),
  clearSelectedDriver: () => set(() => ({ selectedDriver: null })),
}));
