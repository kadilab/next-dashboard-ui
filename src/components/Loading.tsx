"use client";

export default function Loading() {
  return (
    <div
      style={{
        position: "fixed",
        top: 100,
        left: 400,
        width: "50%",
        height: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "rgba(255, 255, 255, 0.8)",
        zIndex: 1000, // Always on top
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #3498db",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      ></div>

      {/* Spinner Animation */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
