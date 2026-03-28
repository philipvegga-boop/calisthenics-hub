interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo = ({ size = "md", className = "" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.png"
        alt="Poder Estoico Logo"
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
      <span className={`font-heading ${textSizeClasses[size]} font-bold`}>
        Poder Estoico
      </span>
    </div>
  );
};

export default Logo;
