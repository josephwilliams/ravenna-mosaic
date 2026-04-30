interface IconProps {
  className?: string;
  size?: number;
}

export function CandleIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 1.5C8 1.5 9.5 3 9.5 4.25C9.5 5.1 8.83 5.75 8 5.75C7.17 5.75 6.5 5.1 6.5 4.25C6.5 3 8 1.5 8 1.5Z"
        fill="currentColor"
        opacity="0.6"
      />
      <rect x="7.25" y="5.5" width="1.5" height="8" rx="0.75" fill="currentColor" opacity="0.3" />
      <rect x="5.5" y="13" width="5" height="1.5" rx="0.75" fill="currentColor" opacity="0.25" />
    </svg>
  );
}

export function QuillIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 1.5C12.5 1.5 14 3.5 11 7.5C8 11.5 4.5 13 3 14L3.5 12C4.5 9.5 6 7 8.5 4.5L12.5 1.5Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M3 14L3.5 12C4 10.5 5 8.5 6.5 6.5"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ScrollIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="2" width="8" height="12" rx="1" fill="currentColor" opacity="0.15" />
      <path d="M6 5H10M6 7.5H10M6 10H8.5" stroke="currentColor" strokeWidth="0.75" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = "", size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7 2.5V11.5M2.5 7H11.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}
