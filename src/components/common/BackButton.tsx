'use client'
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function BackButton({ fallbackHref = '/' }: { fallbackHref?: string }) {
  const router = useRouter();

  return (
    <Button
      variant="disabled"
      className="btn-md"
      testId="back-button"
      onClick={() => {
        const back = sessionStorage.getItem('backHref');
        console.log('backHref:', back);
        sessionStorage.removeItem('backHref');
        router.push(back ?? fallbackHref);
      }}
    >
      Back
    </Button>
  );
}
