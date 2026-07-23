import type { RoomType, VastuData } from "../types/vastu";

export const ROOMS: RoomType[] = [
  "Bedroom",
  "Puja room",
  "Living room",
  "Study room",
];

export const DIRECTION_LABELS = [
  { label: "N", angle: 0, cardinal: true },
  { label: "NE", angle: 45, cardinal: false },
  { label: "E", angle: 90, cardinal: true },
  { label: "SE", angle: 135, cardinal: false },
  { label: "S", angle: 180, cardinal: true },
  { label: "SW", angle: 225, cardinal: false },
  { label: "W", angle: 270, cardinal: true },
  { label: "NW", angle: 315, cardinal: false },
] as const;

export const getCardinalDirection = (deg: number): string => {
  const normalized = ((deg % 360) + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return "N";
  if (normalized >= 22.5 && normalized < 67.5) return "NE";
  if (normalized >= 67.5 && normalized < 112.5) return "E";
  if (normalized >= 112.5 && normalized < 157.5) return "SE";
  if (normalized >= 157.5 && normalized < 202.5) return "S";
  if (normalized >= 202.5 && normalized < 247.5) return "SW";
  if (normalized >= 247.5 && normalized < 292.5) return "W";
  return "NW";
};

export const getVastuDetails = (room: RoomType, deg: number): VastuData => {
  const norm = ((deg % 360) + 360) % 360;

  switch (room) {
    case "Puja room": {
      const isAuspicious = norm >= 315 || norm <= 45;
      const isNeutral = norm > 45 && norm <= 135;
      return {
        statusType: isAuspicious
          ? "auspicious"
          : isNeutral
            ? "neutral"
            : "avoid",
        statusText: isAuspicious
          ? "✓ Auspicious"
          : isNeutral
            ? "~ Neutral"
            : "✕ Avoid",
        subText: isAuspicious
          ? "Auspicious direction for this room"
          : isNeutral
            ? "Acceptable direction for this room"
            : "Avoid placing this room in this direction",
        auspiciousRange: "315° – 45° (NW–NE)",
        neutralRange: "45° – 135° (NE–SE)",
        avoidRange: "135° – 315° (SE–NW)",
        badges: {
          auspicious: "N · NE · E",
          neutral: "E · SE",
          avoid: "S · SW · W",
        },
        tip: "The North-East (Ishan) corner is the most sacred zone for a Puja Room as it enhances divine energy and peaceful clarity.",
      };
    }
    case "Living room": {
      const isAuspicious = norm >= 292.5 || norm <= 90;
      const isNeutral = norm > 90 && norm <= 180;
      return {
        statusType: isAuspicious
          ? "auspicious"
          : isNeutral
            ? "neutral"
            : "avoid",
        statusText: isAuspicious
          ? "✓ Auspicious"
          : isNeutral
            ? "~ Neutral"
            : "✕ Avoid",
        subText: isAuspicious
          ? "Auspicious direction for this room"
          : isNeutral
            ? "Neutral direction for this room"
            : "Avoid this direction for this room",
        auspiciousRange: "292° – 90° (NW–E)",
        neutralRange: "90° – 180° (E–S)",
        avoidRange: "180° – 292° (S–NW)",
        badges: {
          auspicious: "NW · N · NE · E",
          neutral: "E · SE · S",
          avoid: "SW · W",
        },
        tip: "North-West and East facing living rooms encourage smooth social interactions, good hospitality, and positive relationships.",
      };
    }
    case "Study room": {
      const isAuspicious = norm >= 0 && norm <= 90;
      const isNeutral = norm >= 270 && norm < 360;
      return {
        statusType: isAuspicious
          ? "auspicious"
          : isNeutral
            ? "neutral"
            : "avoid",
        statusText: isAuspicious
          ? "✓ Auspicious"
          : isNeutral
            ? "~ Neutral"
            : "✕ Avoid",
        subText: isAuspicious
          ? "Auspicious direction for this room"
          : isNeutral
            ? "Neutral direction for this room"
            : "Avoid this direction for this room",
        auspiciousRange: "0° – 90° (N–E)",
        neutralRange: "270° – 360° (W–N)",
        avoidRange: "90° – 270° (E–W)",
        badges: {
          auspicious: "N · NE · E",
          neutral: "W · NW",
          avoid: "SE · S · SW",
        },
        tip: "Facing North or East while studying improves memory retention, mental sharpness, and academic success.",
      };
    }
    case "Bedroom":
    default: {
      const isAuspicious = norm >= 225 && norm <= 315;
      const isNeutral = norm >= 135 && norm < 225;
      return {
        statusType: isAuspicious
          ? "auspicious"
          : isNeutral
            ? "neutral"
            : "avoid",
        statusText: isAuspicious
          ? "✓ Auspicious"
          : isNeutral
            ? "~ Neutral"
            : "✕ Avoid",
        subText: isAuspicious
          ? "Auspicious direction for this room"
          : isNeutral
            ? "Neutral direction for this room"
            : "Avoid this direction for this room",
        auspiciousRange: "225° – 315° (SW–NW)",
        neutralRange: "135° – 225° (SE–SW)",
        avoidRange: "0° – 135°, 315° – 360°",
        badges: {
          auspicious: "SW · W · NW",
          neutral: "SE · S",
          avoid: "N · NE · E",
        },
        tip: "The ideal direction for a Bedroom is South-West. This promotes stability, rest, and positive energy flow.",
      };
    }
  }
};
