"use client";

import React, { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitButtonprops = {
  children: React.ReactNode;
  className?: string;
} & ComponentProps<"button">;

export default function FormSubmitButton({
  children,
  className,
  ...props
}: FormSubmitButtonprops) {

  const {pending} = useFormStatus();

  return (
    <button 
    {...props}
    className="btn btn-info w-full max-w-xl" 
    type="submit"
    disabled={pending}
    >
      {pending && <span className="loading loading-infinity loading-lg"></span>}
      {children}
    </button>
  );
}
