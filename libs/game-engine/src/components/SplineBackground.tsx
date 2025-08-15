import React from 'react';
import Spline from '@splinetool/react-spline';

interface SplineBackgroundProps {
  sceneUrl?: string;
}

// Renders a full-screen Spline canvas behind the R3F Canvas
export const SplineBackground: React.FC<SplineBackgroundProps> = ({ sceneUrl }) => {
  if (!sceneUrl) return null;
  return (
    <div className="absolute inset-0 -z-10">
      {/* Spline internally manages its own WebGL canvas */}
      <Spline scene={sceneUrl} />
    </div>
  );
};
