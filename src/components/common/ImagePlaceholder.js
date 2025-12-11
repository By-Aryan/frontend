/**
 * Reusable Camera Icon Placeholder Component
 * Shows a camera icon when images are missing or fail to load
 */

const ImagePlaceholder = ({
  size = "medium",
  text = "No Image Available",
  className = ""
}) => {
  // Size configurations
  const sizeConfig = {
    small: {
      container: "h-24 w-32",
      icon: "32px",
      text: "10px"
    },
    medium: {
      container: "h-48 w-full",
      icon: "64px",
      text: "14px"
    },
    large: {
      container: "h-96 w-full",
      icon: "96px",
      text: "18px"
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div
      className={`relative ${config.container} flex flex-col items-center justify-center ${className}`}
      style={{
        backgroundColor: "#e8e8e8",
      }}
    >
      <i
        className="fas fa-camera"
        style={{
          fontSize: config.icon,
          color: "#999",
          marginBottom: size === "small" ? "4px" : size === "large" ? "16px" : "12px"
        }}
      ></i>
      {text && (
        <span
          style={{
            fontSize: config.text,
            color: "#666",
            fontWeight: "500",
            textAlign: "center",
            padding: "0 8px"
          }}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default ImagePlaceholder;
