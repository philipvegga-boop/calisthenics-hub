export const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <img 
        src="/logo-poderestoico.png" 
        alt="Logo" 
        className="h-10 w-10 rounded-full border-2 border-blue-500" 
      />
      <span className="text-xl font-bold text-white">
        PODER ESTOICO
      </span>
    </div>
  );
};
