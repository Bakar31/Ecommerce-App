"use client";

import React, { ComponentProps } from "react";

type FormSubmitButtonprops = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function FormSubmitButton({
  children,
  className,
}: FormSubmitButtonprops) {
  return (
    <button className="btn btn-info w-full max-w-xl" type="submit">
      {children}
    </button>
  );
}
