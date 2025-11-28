import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

//Hook para detectar el estado de la conexión a internet
export const useNetInfo = () => {
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Suscribirse a cambios en la conectividad
    const unsubscribe = NetInfo.addEventListener(state => {
      // state.isConnected puede ser null al inicio
      setIsConnected(state.isConnected ?? true);
console.log('Connection status:', state.isConnected ? 'Online' : 'Offline');
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return { isConnected };
};