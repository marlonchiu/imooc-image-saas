import { type HTMLAttributes } from 'preact/compat'
import { useRef } from 'preact/hooks'

type CommonPreactComponentProps = {
  setChildrenContainer: (ele: HTMLElement | null) => void
}
export type UploadButtonProps = HTMLAttributes<HTMLButtonElement> &
  CommonPreactComponentProps & {
    onFileChose: (files: File[]) => void
  }

export function UploadButton({
  onClick,
  setChildrenContainer,
  children,
  onFileChose,
  ...props
}: UploadButtonProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const handleClick = (e: MouseEvent) => {
    if (inputRef.current) {
      inputRef.current.click()
    }

    if (onClick) {
      onClick(e as any)
    }
  }

  return (
    <>
      <button {...props} onClick={handleClick} ref={(e) => setChildrenContainer(e)}>
        {children}
      </button>
      {/* tabIndex -1 不会被选中 */}
      <input
        tabIndex={-1}
        type="file"
        ref={inputRef}
        onChange={(e) => {
          const filesFromEvent = (e.target as HTMLInputElement).files
          if (filesFromEvent && onFileChose) {
            onFileChose(Array.from(filesFromEvent))
          }
        }}
        style={{ opacity: 0, position: 'fixed', left: -10000 }}
      ></input>
    </>
  )
}
