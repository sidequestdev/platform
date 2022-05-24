import React, { useEffect, useRef } from "react";

export type CanvasProps = {
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  draw(canvas: HTMLCanvasElement): void;
};

export const Canvas: React.FC<CanvasProps> = (props: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current == null) {
      return;
    }

    props.draw(canvasRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={props.width || 640}
      height={props.height || 480}
      style={{
        backgroundColor: "black",
        margin: "1em auto",
        display: "block",
        ...props.style,
      }}
    />
  );
};
