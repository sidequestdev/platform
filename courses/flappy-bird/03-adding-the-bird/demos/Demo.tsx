import React from "react";
import { useEffect } from "react";

export function Demo() {
  useEffect(() => {
    console.log("useEffect");
  });

  console.log("render");

  return (
    <div>
      <h1>Hello</h1>
    </div>
  );
}
