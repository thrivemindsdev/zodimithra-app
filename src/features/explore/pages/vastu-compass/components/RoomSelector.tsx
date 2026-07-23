import { memo } from 'react';
import type { RoomType } from '../types/vastu';
import { ROOMS } from '../utils/vastuConfig';

interface RoomSelectorProps {
  selectedRoom: RoomType;
  onSelectRoom: (room: RoomType) => void;
}

export const RoomSelector = memo<RoomSelectorProps>(({ selectedRoom, onSelectRoom }) => {
  return (
    <div className="flex gap-2 overflow-x-auto w-full max-w-sm pb-2 mb-4 scrollbar-none justify-start md:justify-center">
      {ROOMS.map((room) => {
        const isActive = selectedRoom === room;
        return (
          <button
            key={room}
            onClick={() => onSelectRoom(room)}
            className={`px-4 py-1.5 rounded-full border text-xs font-sans transition-all whitespace-nowrap ${
              isActive
                ? 'border-primary bg-primary text-white shadow-sm font-semibold'
                : 'border-primary bg-white text-primary hover:border-primary'
            }`}
          >
            {room}
          </button>
        );
      })}
    </div>
  );
});

RoomSelector.displayName = 'RoomSelector';