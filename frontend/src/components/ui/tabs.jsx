import * as React from "react"
import { cn } from "../../lib/utils"

const TabsContext = React.createContext()

const Tabs = ({ value, onValueChange, defaultValue, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '')
  
  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value)
    }
  }, [value])
  
  const handleTabChange = (newValue) => {
    if (value === undefined) {
      setActiveTab(newValue)
    }
    onValueChange?.(newValue)
  }
  
  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  const isActive = context?.activeTab === value
  
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive 
          ? "bg-white text-gray-900 shadow-sm" 
          : "text-gray-600 hover:text-gray-900",
        className
      )}
      onClick={() => context?.onTabChange(value)}
      {...props}
    >
      {children}
    </button>
  )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const context = React.useContext(TabsContext)
  const isActive = context?.activeTab === value
  
  if (!isActive) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
