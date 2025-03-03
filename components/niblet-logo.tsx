import React from "react";

interface NibletLogoProps {
  height?: number;
  className?: string;
}

const NibletLogo: React.FC<NibletLogoProps> = ({
  height = 40,
  className = "",
}) => {
  // Calculate width based on height to maintain aspect ratio
  const width = height * 3.5; // Approximate aspect ratio

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Main text "niblet" */}
      <text
        x="0"
        y="30"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="30"
        fill="#000000"
      >
        niblet
      </text>

      {/* ".ai" suffix in blue */}
      <text
        x="80"
        y="30"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="30"
        fill="#3B82F6"
      >
        .ai
      </text>

      {/* Dot for the 'i' */}
    </svg>
  );
};

export default NibletLogo;
