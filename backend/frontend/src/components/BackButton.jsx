import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const BackButton = ({ to = -1, className = '', children = 'Back' }) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (to === -1) {
      navigate(-1)
    } else {
      navigate(to)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 rounded-lg hover:bg-white hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all active:scale-95 ${className}`}
    >
      <ArrowLeft className="w-3 h-3" />
      {children}
    </button>
  )
}

export default BackButton
