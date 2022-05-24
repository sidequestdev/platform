import type React from "react";
import { useEffect, useRef } from "react";

type Callback = (event: { time: number; delta: number }) => void;

/**
 * @see https://github.com/franciscop/use-animation-frame
 */
export const useAnimationFrame = (cb: Callback, deps: React.DependencyList) => {
  const frame = useRef<number>(0);
  const last = useRef(performance.now());
  const init = useRef(performance.now());

  const animate = (hrt: DOMHighResTimeStamp) => {
    const time = (hrt - init.current) / 1000;
    const delta = (hrt - last.current) / 1000;

    // In seconds ~> you can do ms or anything in userland
    cb({ time, delta });

    last.current = hrt;
    frame.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame.current);
  }, deps);
};
