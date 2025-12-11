import Image from "next/image";

export default function LoadingSpinner({
  message = "Loading...",
  fullScreen = false,
  size = "md",
  color = "success"
}) {
  // Size mapping
  const sizeMap = {
    sm: { width: '1.5rem', height: '1.5rem' },
    md: { width: '3rem', height: '3rem' },
    lg: { width: '4rem', height: '4rem' }
  };

  // For full screen loading (original behavior)
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-800">
        <div className="flex flex-col items-center space-y-4">
          <Image
            src="/images/preloader.gif"
            alt="Loading..."
            width={100}
            height={100}
            unoptimized
          />
          <div className="text-white text-xl font-medium">
            {message}
          </div>
        </div>
      </div>
    );
  }

  // For inline loading (new behavior)
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="d-flex flex-column align-items-center">
        <div
          className={`spinner-border text-${color}`}
          role="status"
          style={sizeMap[size]}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && (
          <div className="mt-3 text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
} 