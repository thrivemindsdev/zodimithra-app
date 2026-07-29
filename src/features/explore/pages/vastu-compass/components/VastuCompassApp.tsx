import { CapgoCompass, CompassAccuracy } from "@capgo/capacitor-compass";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useTranslation } from "react-i18next";
import type { RoomType } from "../types/vastu";
import { getVastuDetails } from "../utils/vastuConfig";
import { CompassDial } from "./CompassDial";
import { RoomSelector } from "./RoomSelector";
import { VastuGuidanceCard } from "./VastuGuidanceCard";

export default function VastuCompassApp(): ReactElement {
  const { t } = useTranslation();
  const [selectedRoom, setSelectedRoom] = useState<RoomType>("Bedroom");
  const [degree, setDegree] = useState<number>(36);
  const [accuracy, setAccuracy] = useState<CompassAccuracy>(
    CompassAccuracy.UNKNOWN,
  );
  const [error, setError] = useState<string | null>(null);

  const isDraggingRef = useRef<boolean>(false);
  const headingListenerRef = useRef<any>(null);
  const accuracyListenerRef = useRef<any>(null);

  const handleDragStateChange = useCallback((isDragging: boolean) => {
    isDraggingRef.current = isDragging;
  }, []);

  const handleDegreeChange = useCallback((newDegree: number) => {
    setDegree(newDegree);
  }, []);

  const vastuInfo = useMemo(
    () => getVastuDetails(selectedRoom, degree),
    [selectedRoom, degree],
  );

  // Capgo Native Sensor Management
  const startCapgoCompass = useCallback(async () => {
    try {
      setError(null);

      let status = await CapgoCompass.checkPermissions();
      if (status.compass !== "granted") {
        status = await CapgoCompass.requestPermissions();
        if (status.compass !== "granted") {
          setError("Location permission is required for compass sensor.");
          return;
        }
      }

      headingListenerRef.current = await CapgoCompass.addListener(
        "headingChange",
        (event) => {
          if (!isDraggingRef.current) {
            setDegree(Math.round(event.value));
          }
        },
      );

      accuracyListenerRef.current = await CapgoCompass.addListener(
        "accuracyChange",
        (event) => {
          setAccuracy(event.accuracy);
        },
      );

      await CapgoCompass.startListening({
        minInterval: 100,
        minHeadingChange: 1.0,
      });

      await CapgoCompass.watchAccuracy();

      const initialHeading = await CapgoCompass.getCurrentHeading();
      if (initialHeading && typeof initialHeading.value === "number") {
        setDegree(Math.round(initialHeading.value));
      }

      const initialAccuracy = await CapgoCompass.getAccuracy();
      if (initialAccuracy && initialAccuracy.accuracy) {
        setAccuracy(initialAccuracy.accuracy);
      }
    } catch (err) {
      console.warn(
        "Capgo Compass native plugin not available, using fallback:",
        err,
      );
      setupWebCompassFallback();
    }
  }, []);

  const stopCapgoCompass = useCallback(async () => {
    try {
      await CapgoCompass.stopListening();
      await CapgoCompass.unwatchAccuracy();

      if (headingListenerRef.current) {
        await headingListenerRef.current.remove();
        headingListenerRef.current = null;
      }
      if (accuracyListenerRef.current) {
        await accuracyListenerRef.current.remove();
        accuracyListenerRef.current = null;
      }
    } catch (err) {
      // Safe cleanup ignore
    }
  }, []);

  const setupWebCompassFallback = () => {
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (isDraggingRef.current) return;
      const ev = e as unknown as { webkitCompassHeading?: number };

      if (typeof ev.webkitCompassHeading === "number") {
        setDegree(Math.round(ev.webkitCompassHeading));
      } else if (e.alpha !== null && e.alpha !== undefined) {
        setDegree(Math.round(360 - e.alpha));
      }
    };

    window.addEventListener(
      "deviceorientationabsolute",
      handleDeviceOrientation as EventListener,
      true,
    );
    window.addEventListener("deviceorientation", handleDeviceOrientation, true);
  };

  useEffect(() => {
    startCapgoCompass();
    return () => {
      stopCapgoCompass();
    };
  }, [startCapgoCompass, stopCapgoCompass]);

  const renderAccuracyBadge = () => {
    switch (accuracy) {
      case CompassAccuracy.HIGH:
        return (
          <span className="text-green-600 font-semibold">
            High (&lt;5° error)
          </span>
        );
      case CompassAccuracy.MEDIUM:
        return (
          <span className="text-amber-600 font-semibold">
            Medium (&lt;10° error)
          </span>
        );
      case CompassAccuracy.LOW:
        return (
          <span className="text-red-500 font-semibold">
            Low (Calibrate Device)
          </span>
        );
      case CompassAccuracy.UNRELIABLE:
        return <span className="text-red-600 font-semibold">Unreliable</span>;
      default:
        return <span className="text-gray-500">Normal</span>;
    }
  };

  return (
    <div className="flex flex-col items-center py-6 font-body text-[#3B1F0A]">
      <RoomSelector
        selectedRoom={selectedRoom}
        onSelectRoom={setSelectedRoom}
      />

      <p className="text-center text-xs font-body text-text-primary mb-2">
        {t("vastuCompass.details")}{" "}
        <span className="font-semibold text-[#663814]">{t(`vastuCompass.${selectedRoom}`)}</span>
      </p>

      {error ? (
        <div className="bg-[#FDE8E8] text-[#9B1C1C] p-3 rounded-xl text-center text-xs max-w-sm mb-4">
          <p>{error}</p>
          <button
            onClick={startCapgoCompass}
            className="mt-2 px-3 py-1 bg-[#C0392B] text-white rounded-lg text-xs font-semibold shadow"
          >
            Retry Permission
          </button>
        </div>
      ) : (
        <>
          <CompassDial
            degree={degree}
            onDegreeChange={handleDegreeChange}
            onDragStateChange={handleDragStateChange}
          />

          <p className="text-[11px] text-[#8A6A4B] text-center mb-2">
            Sensor Accuracy: {renderAccuracyBadge()}
          </p>

          <VastuGuidanceCard
            selectedRoom={selectedRoom}
            vastuInfo={vastuInfo}
          />
        </>
      )}
    </div>
  );
}
