
export type RoomType = 'Bedroom' | 'Puja room' | 'Living room' | 'Study room';

export interface VastuData {
  statusText: string;
  subText: string;
  statusType: 'auspicious' | 'neutral' | 'avoid';
  auspiciousRange: string;
  neutralRange: string;
  avoidRange: string;
  badges: {
    auspicious: string;
    neutral: string;
    avoid: string;
  };
  tip: string;
}

export interface CompassDialProps {
  degree: number;
  onDegreeChange: (deg: number) => void;
  onDragStateChange?: (isDragging: boolean) => void;
}