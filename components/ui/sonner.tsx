// "use client"

// import { useTheme } from "next-themes"
// import { Toaster as Sonner, ToasterProps } from "sonner"

// const Toaster = ({ ...props }: ToasterProps) => {
//   const { theme = "system" } = useTheme()

//   return (
//     <Sonner
//       theme={theme as ToasterProps["theme"]}
//       className="toaster group"
//       style={
//         {
//           "--normal-bg": "var(--popover)",
//           "--normal-text": "var(--popover-foreground)",
//           "--normal-border": "var(--border)",
//         } as React.CSSProperties
//       }
//       {...props}
//     />
//   )
// }

// export { Toaster }













"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

/**
 * Toaster component for displaying toast notifications globally.
 *
 * This component wraps the sonner Toaster and provides global configurations
 * such as rich colors (automatic red/green for error/success) and a
 * close button for all toasts.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      // This prop enables automatic rich colors for toast types (success, error, etc.)
      richColors
      
      // This prop adds a close button to every toast
      closeButton
      
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      
      // We'll use toastOptions to apply a global style, which is more flexible
      // than the previous inline style. The richColors prop will handle
      // the error/success colors automatically.
      toastOptions={{
        classNames: {

          toast: 'group toast bg-white! text-foreground border-border shadow-md dark:bg-[#122031]!',
          title: 'text-card-foreground',
          description: 'text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
          closeButton: 'text-primary! bg-white! border-none! shadow-sm! dark:text-white! dark:bg-[#122031]!',
          
          // Specific styling for each toast type
          // These classes override the default toast styles and will ensure
          // the correct text and border colors are applied.
          success: 'text-green-700! border-green-700! dark:text-green-400! dark:border-green-400!',
          error: 'text-red-700! border-red-700! dark:text-red-500! dark:border-red-500!',
          warning: 'text-yellow-500 border-yellow-500 dark:text-yellow-500 dark:border-yellow-500',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
