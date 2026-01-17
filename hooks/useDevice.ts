import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface DeviceInfo {
    type: DeviceType;
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    width: number;
    height: number;
}

// Breakpoints (matching common standards)
const MOBILE_MAX = 640;  // 0-640px = mobile
const TABLET_MAX = 1024; // 641-1024px = tablet
// 1025px+ = desktop

export const useDevice = (): DeviceInfo => {
    const [device, setDevice] = useState<DeviceInfo>(() => getDeviceInfo());

    function getDeviceInfo(): DeviceInfo {
        const width = typeof window !== 'undefined' ? window.innerWidth : 375;
        const height = typeof window !== 'undefined' ? window.innerHeight : 667;

        let type: DeviceType = 'mobile';
        if (width > TABLET_MAX) {
            type = 'desktop';
        } else if (width > MOBILE_MAX) {
            type = 'tablet';
        }

        return {
            type,
            isMobile: type === 'mobile',
            isTablet: type === 'tablet',
            isDesktop: type === 'desktop',
            width,
            height
        };
    }

    useEffect(() => {
        const handleResize = () => {
            setDevice(getDeviceInfo());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return device;
};

export default useDevice;
