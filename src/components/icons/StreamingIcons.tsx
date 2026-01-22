import { SVGProps } from "react";

export function NetflixIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        fill="#e50914"
        d="M8 2h5.2L19 18.3V2h5v28h-5.2L13 13.7V30H8z"
      />
    </svg>
  );
}

export function DisneyPlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" {...props}>
      <path
        fill="#02a7f0"
        d="M42.8 19.7c-.5-5.2-3.4-9.5-8.6-12.6-4.4-2.6-10.3-4-17.4-4.2V4C23.2 4.3 28.3 5.7 32 8.1c4.6 3 7.2 7 7.2 11.7z"
      />
      <path
        fill="#ffffff"
        d="M11 27.4c.5-2.2 1.7-4.2 3.5-5.9 2.6-2.3 6-3.5 10-3.5 4 0 7.4 1.2 10 3.5 1.8 1.7 3 3.7 3.5 5.9h-4.6c-.4-1.3-1.1-2.5-2.3-3.5-1.9-1.6-4.3-2.4-6.6-2.4s-4.7.8-6.6 2.4c-1.2 1-1.9 2.2-2.3 3.5z"
      />
    </svg>
  );
}
