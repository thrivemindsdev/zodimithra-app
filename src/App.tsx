import { AppRoutes } from "@/routes/AppRoutes";
import { QueryProvider } from "./providers/QueryProvider";
import { useEffect, useState } from "react";
import { useAuthStore } from "./store/authStore";

function App() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Check if store finish loading from Capacitor Preferences
    const unsubHydrate = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }

    return () => unsubHydrate();
  }, []);

  // Show splash screen while reading native disk storage
  if (!isHydrated) {
    return <div>Loading...</div>;
  }
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
}

export default App;

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   CapgoCompass,
//   CompassAccuracy,
// } from '@capgo/capacitor-compass';

// export const App: React.FC = () => {
//   const [heading, setHeading] = useState<number | null>(null);
//   const [accuracy, setAccuracy] = useState<CompassAccuracy>(CompassAccuracy.UNKNOWN);
//   const [isListening, setIsListening] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Store handles so we can clean up specific listeners safely
//   const headingListenerRef = useRef<any>(null);
//   const accuracyListenerRef = useRef<any>(null);

//   const startCompass = async () => {
//     try {
//       setError(null);

//       // 1. Check and request permissions (iOS location check)
//       let status = await CapgoCompass.checkPermissions();
//       if (status.compass !== 'granted') {
//         status = await CapgoCompass.requestPermissions();
//         if (status.compass !== 'granted') {
//           setError('Location permission is required on iOS to access compass heading.');
//           return;
//         }
//       }

//       // 2. Attach heading listener (matches HeadingChangeEvent: { value: number })
//       headingListenerRef.current = await CapgoCompass.addListener(
//         'headingChange',
//         (event) => {
//           setHeading(Math.round(event.value));
//         }
//       );

//       // 3. Attach accuracy listener for Android
//       accuracyListenerRef.current = await CapgoCompass.addListener(
//         'accuracyChange',
//         (event) => {
//           setAccuracy(event.accuracy);
//         }
//       );

//       // 4. Start sensor listeners
//       await CapgoCompass.startListening({
//         minInterval: 100,      // Emit every 100ms
//         minHeadingChange: 1.0, // Minimum 1° shift
//       });

//       // 5. Watch accuracy (Android magnetometer)
//       await CapgoCompass.watchAccuracy();

//       // Get initial values immediately
//       const initialHeading = await CapgoCompass.getCurrentHeading();
//       setHeading(Math.round(initialHeading.value));

//       const initialAccuracy = await CapgoCompass.getAccuracy();
//       setAccuracy(initialAccuracy.accuracy);

//       setIsListening(true);
//     } catch (err) {
//       console.error('Failed to start compass:', err);
//       setError(err instanceof Error ? err.message : 'Error starting compass');
//     }
//   };

//   const stopCompass = async () => {
//     try {
//       // Stop native sensors and accuracy monitoring
//       await CapgoCompass.stopListening();
//       await CapgoCompass.unwatchAccuracy();

//       // Remove event listeners
//       if (headingListenerRef.current) {
//         await headingListenerRef.current.remove();
//         headingListenerRef.current = null;
//       }
//       if (accuracyListenerRef.current) {
//         await accuracyListenerRef.current.remove();
//         accuracyListenerRef.current = null;
//       }

//       setIsListening(false);
//     } catch (err) {
//       console.error('Failed to stop compass:', err);
//     }
//   };

//   useEffect(() => {
//     startCompass();

//     // Clean up when component unmounts
//     return () => {
//       stopCompass();
//     };
//   }, []);

//   // Helper to render human-readable accuracy status
//   const renderAccuracyBadge = () => {
//     switch (accuracy) {
//       case CompassAccuracy.HIGH:
//         return <span style={{ color: 'green' }}>High (&lt;5° error)</span>;
//       case CompassAccuracy.MEDIUM:
//         return <span style={{ color: 'orange' }}>Medium (&lt;10° error)</span>;
//       case CompassAccuracy.LOW:
//         return <span style={{ color: 'red' }}>Low (Needs Calibration)</span>;
//       case CompassAccuracy.UNRELIABLE:
//         return <span style={{ color: 'red' }}>Unreliable</span>;
//       default:
//         return <span>Unknown</span>;
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <h2>Capacitor Compass</h2>

//       {error ? (
//         <div style={styles.errorBox}>
//           <p>{error}</p>
//           <button onClick={startCompass} style={styles.button}>Retry</button>
//         </div>
//       ) : (
//         <>
//           <div style={styles.degreeDisplay}>
//             {heading !== null ? `${heading}°` : '---'}
//           </div>

//           {/* Compass Visualiser */}
//           <div style={styles.compassDial}>
//             <div style={styles.northMark}>N</div>
//             <div
//               style={{
//                 ...styles.needle,
//                 transform: `rotate(${heading ?? 0}deg)`,
//               }}
//             />
//           </div>

//           <p style={styles.accuracyText}>
//             Accuracy: {renderAccuracyBadge()}
//           </p>

//           <button
//             onClick={isListening ? stopCompass : startCompass}
//             style={styles.button}
//           >
//             {isListening ? 'Stop Tracking' : 'Start Tracking'}
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// const styles: Record<string, React.CSSProperties> = {
//   container: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: '100vh',
//     fontFamily: 'sans-serif',
//     padding: '20px',
//     boxSizing: 'border-box',
//   },
//   degreeDisplay: {
//     fontSize: '48px',
//     fontWeight: 'bold',
//     margin: '10px 0',
//   },
//   compassDial: {
//     width: '200px',
//     height: '200px',
//     borderRadius: '50%',
//     border: '4px solid #333',
//     position: 'relative',
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     margin: '20px 0',
//   },
//   northMark: {
//     position: 'absolute',
//     top: '8px',
//     fontWeight: 'bold',
//     color: '#d9534f',
//   },
//   needle: {
//     width: '4px',
//     height: '80px',
//     backgroundColor: '#d9534f',
//     transformOrigin: 'bottom center',
//     transition: 'transform 0.1s linear',
//     borderRadius: '2px',
//   },
//   accuracyText: {
//     fontSize: '14px',
//     marginBottom: '20px',
//   },
//   button: {
//     padding: '10px 20px',
//     fontSize: '16px',
//     borderRadius: '8px',
//     border: 'none',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     cursor: 'pointer',
//   },
//   errorBox: {
//     color: '#d9534f',
//     textAlign: 'center',
//   },
// };

// export default App;