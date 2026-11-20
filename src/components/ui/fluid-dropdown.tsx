"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig, type Variants } from "motion/react"
import { ChevronDown, Layers01, Sparkles, Settings02, Grid } from "../icons"

// Utility function for className merging
function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

// Custom hook for click outside detection
function useClickAway(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return
      }
      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler])
}

// Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline"
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "outline" && "border border-border bg-transparent",
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// Types
export interface Category {
  id: string
  label: string
  icon: React.ElementType
  color: string
}

export const defaultCategories: Category[] = [
  { id: "all", label: "All", icon: Layers01, color: "#A06CD5" },
  { id: "lifestyle", label: "Appearance", icon: Sparkles, color: "#FF6B6B" },
  { id: "desk", label: "Scene", icon: Settings02, color: "#4ECDC4" },
  { id: "tech", label: "Grid", icon: Grid, color: "#45B7D1" },
  { id: "home", label: "Essentials", icon: Layers01, color: "#F9C74F" },
]

// Icon wrapper with animation
const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}: { icon: React.ElementType; isHovered: boolean; color: string }) => (
  <motion.div
    className="size-5 mr-2 relative shrink-0 flex items-center justify-center"
    initial={false}
    animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
  >
    <Icon
      size={18}
      strokeColor={isHovered ? color : "currentColor"}
      className="transition-colors duration-200"
    />
  </motion.div>
)

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export interface FluidDropdownProps {
  categories?: Category[]
  selectedCategory?: Category
  onSelectCategory?: (category: Category) => void
  className?: string
}

// Main component
export function Component({
  categories = defaultCategories,
  selectedCategory: externalSelectedCategory,
  onSelectCategory,
  className,
}: FluidDropdownProps = {}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalSelectedCategory, setInternalSelectedCategory] = React.useState<Category>(
    categories[0] || defaultCategories[0]
  )
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const activeCategory = externalSelectedCategory || internalSelectedCategory

  // Sync internal if categories change
  React.useEffect(() => {
    if (!externalSelectedCategory && categories.length > 0) {
      if (!categories.some((c) => c.id === internalSelectedCategory.id)) {
        setInternalSelectedCategory(categories[0]);
      }
    }
  }, [categories, externalSelectedCategory, internalSelectedCategory.id]);

  useClickAway(dropdownRef, () => setIsOpen(false))

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const activeIndex = Math.max(
    0,
    categories.findIndex((c) => (hoveredCategory || activeCategory.id) === c.id)
  )

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn("w-full relative", className)}
        ref={dropdownRef}
      >
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between bg-secondary text-muted-foreground",
              "hover:bg-accent hover:text-foreground",
              "focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
              "transition-all duration-200 ease-in-out cursor-pointer",
              "border border-border focus:border-ring",
              "h-10",
              isOpen && "bg-secondary text-foreground",
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center min-w-0 truncate">
              <IconWrapper 
                icon={activeCategory.icon} 
                isHovered={false} 
                color={activeCategory.color} 
              />
              <span className="truncate">{activeCategory.label}</span>
            </span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center size-5 shrink-0 ml-2"
            >
              <ChevronDown size={16} />
            </motion.div>
          </Button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 1, y: 0, height: 0 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                exit={{
                  opacity: 0,
                  y: 0,
                  height: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1,
                  },
                }}
                className="absolute left-0 right-0 top-full mt-2 z-50"
                onKeyDown={handleKeyDown}
              >
                <motion.div
                  className="w-full rounded-lg border border-border bg-popover p-1 shadow-lg"
                  initial={{ borderRadius: 8 }}
                  animate={{
                    borderRadius: 12,
                    transition: { duration: 0.2 },
                  }}
                  style={{ transformOrigin: "top" }}
                >
                  <motion.div 
                    className="py-2 relative" 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate="visible"
                  >
                    <motion.div
                      layoutId="hover-highlight"
                      className="absolute inset-x-1 bg-secondary rounded-md pointer-events-none"
                      animate={{
                        y: activeIndex * 40 + (activeIndex > 0 && categories.length > 1 ? 20 : 0),
                        height: 40,
                      }}
                      transition={{
                        type: "spring",
                        bounce: 0.15,
                        duration: 0.5,
                      }}
                    />
                    {categories.map((category, index) => (
                      <React.Fragment key={category.id}>
                        {index === 1 && (
                          <motion.div 
                            className="mx-4 my-2.5 border-t border-border" 
                            variants={itemVariants} 
                          />
                        )}
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectCategory) {
                              onSelectCategory(category)
                            }
                            setInternalSelectedCategory(category)
                            setIsOpen(false)
                          }}
                          onHoverStart={() => setHoveredCategory(category.id)}
                          onHoverEnd={() => setHoveredCategory(null)}
                          className={cn(
                            "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md cursor-pointer",
                            "transition-colors duration-150",
                            "focus:outline-none",
                            activeCategory.id === category.id || hoveredCategory === category.id
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                        >
                          <IconWrapper
                            icon={category.icon}
                            isHovered={hoveredCategory === category.id}
                            color={category.color}
                          />
                          <span className="truncate">{category.label}</span>
                        </motion.button>
                      </React.Fragment>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </MotionConfig>
  )
}

export default Component
