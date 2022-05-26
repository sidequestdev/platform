import React, { useRef, useState } from "react";
import type { CanvasProps } from "~/components/Canvas";
import { useAnimationFrame } from "~/lib/hooks/useAnimationFrame";
import { circleRectangleIntersects } from "./lib/circle-rectangle-intersects";

type CircleVsRectangleProps = Omit<CanvasProps, "draw">;

export const CircleVsRectangle: React.FC<CircleVsRectangleProps> = (
  props: CircleVsRectangleProps
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const circle = {
    radius: 25,
  };
  const rectangle = {
    width: 100,
    height: 120,
  };

  function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
    if (canvasRef.current == null) {
      return;
    }

    event.preventDefault();

    setMouse({
      x: event.nativeEvent.pageX - canvasRef.current.offsetLeft,
      y: event.nativeEvent.pageY - canvasRef.current.offsetTop,
    });
  }

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

      ctx.translate(canvasRef.current.width / 2, canvasRef.current.height / 2);

      ctx.fillStyle = "#41435a";
      ctx.fillRect(
        -(rectangle.width / 2),
        -(rectangle.height / 2),
        rectangle.width,
        rectangle.height
      );

      ctx.resetTransform();

      ctx.translate(mouse.x, mouse.y);

      const collision = circleRectangleIntersects(
        mouse.x,
        mouse.y,
        circle.radius,
        canvasRef.current.width / 2 - rectangle.width / 2,
        canvasRef.current.height / 2 - rectangle.height / 2,
        rectangle.width,
        rectangle.height
      );

      if (collision.intersects) {
        ctx.fillStyle = "#bf6a32";
      } else {
        ctx.fillStyle = "#a6aa62";
      }

      ctx.beginPath();
      ctx.arc(0, 0, circle.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.resetTransform();

      ctx.translate(collision.x, collision.y);
      ctx.fillStyle = "#dfd8c0";
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#dfd8c0";
      ctx.lineWidth = 2;
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, collision.height);
      ctx.lineTo(mouse.x - collision.x, mouse.y - collision.y);
      ctx.lineTo(0, 0);
      ctx.stroke();

      ctx.resetTransform();

      ctx.font = "12pt monospace";
      ctx.fillText(`testX: ${collision.x}`, 10, 20);
      ctx.fillText(`testY: ${collision.y}`, 10, 40);
      ctx.fillText(
        `distance: ${((collision.distance * 100) | 0) / 100}`,
        10,
        60
      );
      ctx.fillText(`intersects: ${collision.intersects}`, 10, 80);
    },
    [canvasRef, mouse]
  );

  return (
    <canvas
      ref={canvasRef}
      width={props.width ?? 480}
      height={props.height ?? 480}
      onMouseMove={handleMouseMove}
      style={{
        backgroundColor: "#242526",
        margin: "1em auto",
        display: "block",
        ...props.style,
      }}
    />
  );
};
