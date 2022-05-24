import { CanvasProps } from "@site/src/components/Canvas";
import { useAnimationFrame } from "@site/src/hooks/useAnimationFrame";
import React, { useRef } from "react";

type RotateCanvasProps = Omit<CanvasProps, "draw">;

export const RotateCanvasDefaultOrigin: React.FC<RotateCanvasProps> = (
  props: RotateCanvasProps,
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useAnimationFrame(
    (event) => {
      if (canvasRef?.current == null) {
        return;
      }

      const ctx = canvasRef.current.getContext("2d");

      if (ctx == null) {
        return;
      }

      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      ctx.rotate(event.time);

      ctx.fillStyle = "yellow";
      ctx.fillRect(
        canvasRef.current.width / 2 - 25,
        canvasRef.current.height / 2 - 25,
        50,
        50,
      );

      ctx.resetTransform();
    },
    [canvasRef],
  );

  return (
    <canvas
      ref={canvasRef}
      width={props.width ?? 640}
      height={props.height ?? 480}
      style={{
        backgroundColor: "#242526",
        margin: "1em auto",
        display: "block",
        ...props.style,
      }}
    />
  );
};
