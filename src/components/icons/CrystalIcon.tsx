interface CrystalIconProps {
  className?: string;
  glowColor?: 'gold' | 'turquoise' | 'purple' | 'crystal';
}

const CrystalIcon = ({ className = '', glowColor = 'crystal' }: CrystalIconProps) => {
  const glowClasses = {
    gold: 'text-gold drop-shadow-[0_0_10px_hsl(45,100%,60%,0.8)]',
    turquoise: 'text-turquoise drop-shadow-[0_0_10px_hsl(174,100%,50%,0.8)]',
    purple: 'text-purple-light drop-shadow-[0_0_10px_hsl(270,60%,60%,0.8)]',
    crystal: 'text-crystal drop-shadow-[0_0_10px_hsl(220,80%,70%,0.8)]',
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={`${className} ${glowClasses[glowColor]}`}
    >
      <path
        d="M12 2L4 8L12 22L20 8L12 2Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path
        d="M12 2L4 8L12 14L20 8L12 2Z"
        fill="currentColor"
        fillOpacity="0.5"
      />
      <path
        d="M12 2L4 8L12 22L20 8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 2V22"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
      <path
        d="M4 8L20 8"
        stroke="currentColor"
        strokeWidth="1"
        strokeOpacity="0.5"
      />
    </svg>
  );
};

export default CrystalIcon;
