import { Portal } from "./portal";
import { cn } from "~/lib/utils";

interface props{
  children: React.ReactNode,
  isOpen: boolean,
  ariaLabel?: string,
  className?: string
  onChange: () => void
}

export const Modal: React.FC<props> = ({children, isOpen, ariaLabel, className, onChange}) => {
  if(!isOpen) return null

  return (
    <Portal wrapperId="modal">
      <div
        className="fixed inset-0 overflow-hidden bg-gray-600 bg-opacity-80 z-20"
        aria-labelledby={ariaLabel ?? "modal-title"}
        role="dialog"
        aria-modal="true"
        onClick={onChange}
        >
        </div>
        <div className="fixed inset-0 pointer-events-none flex justify-center items-center max-h-screen overflow-scroll z-30">
          <div className={cn('p-2 bg-gray-200 pointer-events-auto md:rounded-xl z-40 mt-48 mb-10', className)}>
            {children}
          </div>
        </div>
    </Portal>
  )
}