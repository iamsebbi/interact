"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, MotionConfig, type Variants } from "motion/react"
import { ChevronDown, Layers01, Sparkles, Settings02, Grid } from "../icons"
import { cn } from "@/lib/utils"

// Custom hook for click outside detection
function useClickAway(
  refA: React.RefObject<HTMLElement | null>,
  refB: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (refA.current?.contains(target) || refB.current?.contains(target)) {
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
  }, [refA, refB, handler])
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
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-0",
          "disabled:pointer-events-none disabled:opacity-50",
          variant === "outline" && "border border-border",
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
  icon?: React.ElementType
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
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.02,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export interface FluidDropdownProps {
  categories?: Category[]
  selectedCategory?: Category
  onSelectCategory?: (category: Category) => void
  label?: string
  className?: string
  triggerClassName?: string
  showDividerAfterFirst?: boolean
  portal?: boolean
  renderIcon?: (
    category: Category,
    state: { isHovered: boolean; isSelected: boolean; inTrigger?: boolean }
  ) => React.ReactNode
}

// Main component
export function Component({
  categories = defaultCategories,
  selectedCategory: externalSelectedCategory,
  onSelectCategory,
  label,
  className,
  triggerClassName,
  showDividerAfterFirst = true,
  portal = false,
  renderIcon,
}: FluidDropdownProps = {}) {
  const uid = React.useId()
  const [isOpen, setIsOpen] = React.useState(false)
  const [internalSelectedCategory, setInternalSelectedCategory] = React.useState<Category>(
    categories[0] || defaultCategories[0]
  )
  const [hoveredCategory, setHoveredCategory] = React.useState<string | null>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [portalPos, setPortalPos] = React.useState<{
    left: number
    top: number
    width: number
    openUp: boolean
  } | null>(null)

  const activeCategory = externalSelectedCategory || internalSelectedCategory

  // Sync internal if categories change
  React.useEffect(() => {
    if (!externalSelectedCategory && categories.length > 0) {
      if (!categories.some((c) => c.id === internalSelectedCategory.id)) {
        setInternalSelectedCategory(categories[0]);
      }
    }
  }, [categories, externalSelectedCategory, internalSelectedCategory.id]);

  const closeMenu = React.useCallback(() => setIsOpen(false), [])
  useClickAway(dropdownRef, menuRef, closeMenu)

  const updatePortalPos = React.useCallback(() => {
    if (!portal || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const rawHeight =
      categories.length * 40 + (showDividerAfterFirst && categories.length > 1 ? 20 : 0) + 24
    const estimatedHeight = Math.min(rawHeight, Math.round(window.innerHeight * 0.55) + 20, 340)
    const spaceBelow = window.innerHeight - rect.bottom - 12
    const openUp = spaceBelow < estimatedHeight && rect.top > spaceBelow
    setPortalPos({
      left: rect.left,
      top: openUp ? rect.top - 8 : rect.bottom + 8,
      width: rect.width,
      openUp,
    })
  }, [portal, categories.length, showDividerAfterFirst])

  React.useLayoutEffect(() => {
    if (!isOpen || !portal) return
    updatePortalPos()
    window.addEventListener("resize", updatePortalPos)
    window.addEventListener("scroll", updatePortalPos, true)
    return () => {
      window.removeEventListener("resize", updatePortalPos)
      window.removeEventListener("scroll", updatePortalPos, true)
    }
  }, [isOpen, portal, updatePortalPos])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const activeIndex = Math.max(
    0,
    categories.findIndex((c) => (hoveredCategory || activeCategory.id) === c.id)
  )
  const hasDivider = showDividerAfterFirst && categories.length > 1
  const highlightY =
    activeIndex * 40 + (hasDivider && activeIndex > 0 ? 20 : 0)

  const renderItemIcon = (
    category: Category,
    isHovered: boolean,
    isSelected: boolean,
    inTrigger = false
  ) => {
    if (renderIcon) {
      return renderIcon(category, { isHovered, isSelected, inTrigger })
    }
    if (!category.icon) return null
    return (
      <IconWrapper
        icon={category.icon}
        isHovered={isHovered}
        color={category.color}
      />
    )
  }

  const menuContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          ref={menuRef}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={
            portal && portalPos
              ? {
                  position: "fixed",
                  left: portalPos.left,
                  top: portalPos.top,
                  width: portalPos.width,
                  transform: portalPos.openUp ? "translateY(-100%)" : undefined,
                  zIndex: 90,
                }
              : undefined
          }
          className={cn(
            !portal && "absolute left-0 right-0 top-full mt-2 z-50"
          )}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="w-full rounded-[20px] bg-popover p-1.5"
            initial={{
              opacity: 0,
              scale: 0.97,
              y: portal && portalPos?.openUp ? 4 : -4,
              borderRadius: 14,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              borderRadius: 20,
              transition: {
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.97,
              y: portal && portalPos?.openUp ? 4 : -4,
              borderRadius: 14,
              transition: {
                duration: 0.16,
                ease: [0.22, 1, 0.36, 1],
              },
            }}
            style={{
              transformOrigin: portal && portalPos?.openUp ? "bottom" : "top",
            }}
          >
            <motion.div
              className="py-0.5 relative max-h-[min(320px,55dvh)] overflow-y-auto no-scrollbar"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                layoutId={`hover-highlight-${uid}`}
                className="absolute inset-x-0.5 bg-secondary rounded-[14px] pointer-events-none"
                animate={{
                  y: highlightY + 2,
                  height: 40,
                }}
                transition={{
                  type: "spring",
                  bounce: 0.15,
                  duration: 0.45,
                }}
              />
              {categories.map((category, index) => {
                const isSelected = activeCategory.id === category.id
                const isHovered = hoveredCategory === category.id
                return (
                  <React.Fragment key={category.id}>
                    {hasDivider && index === 1 && (
                      <motion.div
                        className="mx-3.5 my-2.5 border-t border-border"
                        variants={itemVariants}
                      />
                    )}
                    <motion.button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (onSelectCategory) {
                          onSelectCategory(category)
                        }
                        setInternalSelectedCategory(category)
                        setIsOpen(false)
                      }}
                      onHoverStart={() => setHoveredCategory(category.id)}
                      onHoverEnd={() => setHoveredCategory(null)}
                      className={cn(
                        "relative flex h-10 w-full items-center px-3 text-sm rounded-[14px] cursor-pointer",
                        "transition-colors duration-150",
                        "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/60 focus-visible:ring-inset",
                        isSelected || isHovered
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      )}
                      whileTap={{ scale: 0.98 }}
                      variants={itemVariants}
                    >
                      {renderItemIcon(category, isHovered, isSelected)}
                      <span className="truncate">{category.label}</span>
                    </motion.button>
                  </React.Fragment>
                )
              })}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={cn("w-full relative", className)}
        ref={dropdownRef}
      >
          <Button
            ref={triggerRef}
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "w-full justify-between bg-secondary/80 text-muted-foreground",
              "hover:bg-secondary hover:text-foreground",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-0",
              "transition-all duration-200 ease-in-out cursor-pointer",
              "border border-border focus-visible:border-ring",
              "h-10",
              isOpen && "bg-secondary text-foreground",
              triggerClassName
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            {label ? (
              <>
                <span className="text-xs font-normal text-muted-foreground shrink-0">
                  {label}
                </span>
                <span className="flex items-center gap-1.5 min-w-0 ml-2">
                  {renderItemIcon(activeCategory, false, true, true)}
                  <span className="truncate font-medium text-foreground">
                    {activeCategory.label}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center size-4 shrink-0 text-muted-foreground"
                  >
                    <ChevronDown size={14} />
                  </motion.div>
                </span>
              </>
            ) : (
              <>
                <span className="flex items-center min-w-0 truncate">
                  {renderItemIcon(activeCategory, false, true, true)}
                  <span className="truncate">{activeCategory.label}</span>
                </span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center size-5 shrink-0 ml-2"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </>
            )}
          </Button>

          {portal && typeof document !== "undefined"
            ? createPortal(menuContent, document.body)
            : menuContent}
        </div>
    </MotionConfig>
  )
}

export default Component
