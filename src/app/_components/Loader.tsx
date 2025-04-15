import React from "react";
import { PacmanLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <PacmanLoader color="#3B82F6" />
    </div>
  );
}
