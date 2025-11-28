interface RuneIconProps {
  className?: string;
  variant?: 1 | 2 | 3;
}

const RuneIcon = ({ className = '', variant = 1 }: RuneIconProps) => {
  const runes = {
    1: (
      <path
        d="M12 2V22M8 6L16 18M16 6L8 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    2: (
      <>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M12 4V12L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 12L7 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
    3: (
      <>
        <polygon points="12,2 22,12 12,22 2,12" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="3" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} text-gold drop-shadow-[0_0_8px_hsl(45,100%,60%,0.6)]`}
    >
      {runes[variant]}
    </svg>
  );
};

export default RuneIcon;
