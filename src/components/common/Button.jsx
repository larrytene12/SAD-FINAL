import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  isLoading = false, 
  className = '', 
  disabled = false 
}) => {
  
  const baseStyle = "relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    // Gradient Teal-Blue (Khas Medis)
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/30 border border-transparent",
    
    // Gradient Merah (Danger)
    danger: "bg-gradient-to-r from-rose-500 to-red-600 text-white hover:shadow-lg hover:shadow-rose-500/30 border border-transparent",
    
    // Glass Style (Secondary)
    outline: "bg-white/50 text-slate-700 border border-slate-200 hover:bg-white hover:border-cyan-400 hover:text-cyan-600 backdrop-blur-sm",
    
    // Ghost (Tanpa background)
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100/50"
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
    >
      {/* Efek Kilau (Shine) saat hover */}
      <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 rounded-xl pointer-events-none"></div>

      {isLoading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

export default Button;