"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Type,
  ImageIcon,
  Square,
  Circle,
  Triangle,
  Diamond,
  Heart,
  Star,
  Download,
  Save,
  Undo,
  Redo,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Upload,
  ChevronDown,
  Loader2,
  Move,
  Plus,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { saveProject, updateProject, trackEvent } from "@/lib/api-service"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ProductConfigurator } from "@/components/shopping/product-configurator"
import { ShoppingCartComponent } from "@/components/shopping/shopping-cart"
import { CheckoutModal } from "@/components/shopping/checkout-modal"
import type { CartItem, CheckoutData } from "@/lib/shopping-types"

interface TemplateElement {
  type: string
  content: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  color?: string
  id?: string
  width?: number
  height?: number
  bold?: boolean
  italic?: boolean
  underline?: boolean
  align?: string
  src?: string
  borderWidth?: number
  borderColor?: string
  borderStyle?: string
  borderRadius?: number
  shapeType?: string
  fillColor?: string
}

interface Template {
  id: string
  name: string
  category: string
  elements: TemplateElement[]
}

interface InvitationEditorProps {
  template: Template
  onBack: () => void
}

export function InvitationEditor({ template, onBack }: InvitationEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [elements, setElements] = useState<TemplateElement[]>(
    template.elements.map((el, index) => ({ ...el, id: `element-${index}` })),
  )
  const [selectedElement, setSelectedElement] = useState<TemplateElement | null>(null)
  const [tool, setTool] = useState<string>("select")
  const [canvasSize, setCanvasSize] = useState({ width: 400, height: 600 })
  const [canvasScale, setCanvasScale] = useState(1)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map())
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [activeTab, setActiveTab] = useState("tools")

  // Shopping system state
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCheckout, setShowCheckout] = useState(false)

  const { user } = useAuth()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)

  // Responsive canvas sizing and DPI scaling
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current
      if (!canvas || !containerRef.current) return

      const container = containerRef.current
      const containerWidth = container.clientWidth - 32
      const containerHeight = container.clientHeight - 32

      const baseWidth = 400
      const baseHeight = 600
      const devicePixelRatio = window.devicePixelRatio || 1

      // Set canvas element's physical dimensions for high DPI
      canvas.width = baseWidth * devicePixelRatio
      canvas.height = baseHeight * devicePixelRatio

      // Set canvas element's CSS dimensions to maintain visual size
      canvas.style.width = `${baseWidth}px`
      canvas.style.height = `${baseHeight}px`

      // Calculate overall scale for fitting into container
      let scale = 1
      if (containerWidth < baseWidth || containerHeight < baseHeight) {
        const scaleX = containerWidth / baseWidth
        const scaleY = containerHeight / baseHeight
        scale = Math.min(scaleX, scaleY, 1)
      }

      setCanvasSize({ width: baseWidth, height: baseHeight })
      setCanvasScale(scale)
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  useEffect(() => {
    drawCanvas()
  }, [elements, selectedElement, loadedImages, canvasSize])

  // Shopping system handlers
  const handleAddToCart = (item: CartItem) => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Sepete ürün eklemek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      return
    }

    setCartItems((prev) => [...prev, item])

    trackEvent({
      event: "product_added_to_cart",
      userId: user.id,
      data: {
        productType: item.type,
        quantity: item.quantity,
        price: item.price,
        templateId: template.id,
      },
    })
  }

  const handleDirectPurchase = (item: CartItem) => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Satın alma işlemi için giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      return
    }

    setCartItems([item])
    setShowCheckout(true)

    trackEvent({
      event: "direct_purchase_initiated",
      userId: user.id,
      data: {
        productType: item.type,
        quantity: item.quantity,
        price: item.price,
        templateId: template.id,
      },
    })
  }

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity } : item)))
  }

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId))
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Satın alma işlemi için giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      return
    }

    setShowCheckout(true)
  }

  const handleOrderComplete = async (orderData: CheckoutData) => {
    try {
      // Track successful order
      await trackEvent({
        event: "order_completed",
        userId: user?.id,
        data: {
          orderId: orderData.orderId,
          orderTotal: orderData.orderTotal,
          itemCount: cartItems.length,
          templateId: template.id,
        },
      })

      // Clear cart after successful order
      setCartItems([])
      setShowCheckout(false)

      toast({
        title: "Sipariş Tamamlandı!",
        description: "Siparişiniz başarıyla alındı. E-posta ile bilgilendirme yapılacaktır.",
      })
    } catch (error) {
      console.error("Order completion error:", error)
    }
  }

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedImages.has(src)) {
        resolve(loadedImages.get(src)!)
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setLoadedImages((prev) => new Map(prev).set(src, img))
        resolve(img)
      }
      img.onerror = reject
      img.src = src
    })
  }

  const drawShape = (ctx: CanvasRenderingContext2D, element: TemplateElement) => {
    const width = element.width || 100
    const height = element.height || 100
    const x = element.x
    const y = element.y

    ctx.save()

    if (element.fillColor && element.fillColor !== "transparent") {
      ctx.fillStyle = element.fillColor
    }
    if (element.borderColor) {
      ctx.strokeStyle = element.borderColor
      ctx.lineWidth = element.borderWidth || 2
      if (element.borderStyle === "dashed") {
        ctx.setLineDash([5, 5])
      }
    }

    ctx.beginPath()

    switch (element.shapeType) {
      case "rectangle":
        ctx.rect(x - width / 2, y - height / 2, width, height)
        break
      case "circle":
        ctx.arc(x, y, Math.min(width, height) / 2, 0, 2 * Math.PI)
        break
      case "ellipse":
        ctx.ellipse(x, y, width / 2, height / 2, 0, 0, 2 * Math.PI)
        break
      case "triangle":
        ctx.moveTo(x, y - height / 2)
        ctx.lineTo(x - width / 2, y + height / 2)
        ctx.lineTo(x + width / 2, y + height / 2)
        ctx.closePath()
        break
      case "diamond":
        ctx.moveTo(x, y - height / 2)
        ctx.lineTo(x + width / 2, y)
        ctx.lineTo(x, y + height / 2)
        ctx.lineTo(x - width / 2, y)
        ctx.closePath()
        break
      case "heart":
        const heartWidth = width / 2
        const heartHeight = height / 2
        ctx.moveTo(x, y + heartHeight / 4)
        ctx.bezierCurveTo(x, y - heartHeight / 2, x - heartWidth, y - heartHeight / 2, x - heartWidth, y)
        ctx.bezierCurveTo(x - heartWidth, y + heartHeight / 4, x, y + heartHeight / 2, x, y + heartHeight)
        ctx.bezierCurveTo(x, y + heartHeight / 2, x + heartWidth, y + heartHeight / 4, x + heartWidth, y)
        ctx.bezierCurveTo(x + heartWidth, y - heartHeight / 2, x, y - heartHeight / 2, x, y + heartHeight / 4)
        break
      case "star":
        const spikes = 5
        const outerRadius = Math.min(width, height) / 2
        const innerRadius = outerRadius * 0.4
        let rot = (Math.PI / 2) * 3
        const step = Math.PI / spikes

        ctx.moveTo(x, y - outerRadius)
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius)
          rot += step
          ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius)
          rot += step
        }
        ctx.lineTo(x, y - outerRadius)
        ctx.closePath()
        break
      case "hexagon":
        const hexRadius = Math.min(width, height) / 2
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3
          const hexX = x + hexRadius * Math.cos(angle)
          const hexY = y + hexRadius * Math.sin(angle)
          if (i === 0) ctx.moveTo(hexX, hexY)
          else ctx.lineTo(hexX, hexY)
        }
        ctx.closePath()
        break
      default:
        ctx.rect(x - width / 2, y - height / 2, width, height)
    }

    if (element.fillColor && element.fillColor !== "transparent") {
      ctx.fill()
    }
    if (element.borderColor) {
      ctx.stroke()
    }

    ctx.restore()
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const devicePixelRatio = window.devicePixelRatio || 1

    // Clear canvas and apply DPI scaling
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(devicePixelRatio, devicePixelRatio)

    // Draw background and border
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height)

    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvasSize.width, canvasSize.height)

    elements.forEach((element) => {
      if (element.type === "text") {
        ctx.fillStyle = element.color || "#000000"
        let font = `${element.fontSize || 16}px ${element.fontFamily || "serif"}`
        if (element.bold) font = `bold ${font}`
        if (element.italic) font = `italic ${font}`
        ctx.font = font
        ctx.textAlign = (element.align as CanvasTextAlign) || "center"
        ctx.fillText(element.content, element.x, element.y)

        if (element.underline) {
          const metrics = ctx.measureText(element.content)
          const startX =
            element.align === "left"
              ? element.x
              : element.align === "right"
                ? element.x - metrics.width
                : element.x - metrics.width / 2
          ctx.beginPath()
          ctx.moveTo(startX, element.y + 2)
          ctx.lineTo(startX + metrics.width, element.y + 2)
          ctx.stroke()
        }
      } else if (element.type === "image" && element.src) {
        const img = loadedImages.get(element.src)
        if (img) {
          const width = element.width || 100
          const height = element.height || 100
          ctx.drawImage(img, element.x - width / 2, element.y - height / 2, width, height)
        }
      } else if (element.type === "shape") {
        drawShape(ctx, element)
      } else if (element.type === "border") {
        const width = element.width || 200
        const height = element.height || 150
        const x = element.x - width / 2
        const y = element.y - height / 2

        ctx.save()
        ctx.strokeStyle = element.borderColor || "#000000"
        ctx.lineWidth = element.borderWidth || 2

        if (element.borderStyle === "dashed") {
          ctx.setLineDash([5, 5])
        } else {
          ctx.setLineDash([])
        }

        if (element.color && element.color !== "transparent") {
          ctx.fillStyle = element.color
          if (element.borderRadius && element.borderRadius > 0) {
            ctx.beginPath()
            ctx.roundRect(x, y, width, height, element.borderRadius)
            ctx.fill()
          } else {
            ctx.fillRect(x, y, width, height)
          }
        }

        ctx.beginPath()
        if (element.borderRadius && element.borderRadius > 0) {
          ctx.roundRect(x, y, width, height, element.borderRadius)
        } else {
          ctx.rect(x, y, width, height)
        }
        ctx.stroke()
        ctx.restore()
      }

      if (selectedElement && selectedElement.id === element.id) {
        ctx.strokeStyle = "#3b82f6"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])

        if (element.type === "text") {
          const metrics = ctx.measureText(element.content)
          ctx.strokeRect(
            element.x - metrics.width / 2 - 5,
            element.y - (element.fontSize || 16) - 5,
            metrics.width + 10,
            (element.fontSize || 16) + 10,
          )
        } else if (element.type === "image" || element.type === "shape" || element.type === "border") {
          const width = element.width || 100
          const height = element.height || 100
          ctx.strokeRect(element.x - width / 2 - 5, element.y - height / 2 - 5, width + 10, height + 10)
        }
        ctx.setLineDash([])
      }
    })
    ctx.restore() // Restore after all drawing
  }

  const getElementAtPosition = (x: number, y: number): TemplateElement | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    // x and y are already in logical canvas coordinates
    const touchPadding = 8 // Padding in logical canvas units

    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i]

      if (element.type === "text") {
        const ctx = canvas.getContext("2d")
        if (!ctx) continue
        ctx.font = `${element.fontSize || 16}px ${element.fontFamily || "serif"}`
        const metrics = ctx.measureText(element.content)

        if (
          x >= element.x - metrics.width / 2 - touchPadding &&
          x <= element.x + metrics.width / 2 + touchPadding &&
          y >= element.y - (element.fontSize || 16) - touchPadding &&
          y <= element.y + touchPadding
        ) {
          return element
        }
      } else if (element.type === "image" || element.type === "shape" || element.type === "border") {
        const width = element.width || 100
        const height = element.height || 100

        if (
          x >= element.x - width / 2 - touchPadding &&
          x <= element.x + width / 2 + touchPadding &&
          y >= element.y - height / 2 - touchPadding &&
          y <= element.y + height / 2 + touchPadding
        ) {
          return element
        }
      }
    }
    return null
  }

  const getCanvasCoordinates = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    // Return coordinates relative to the logical canvas size
    return {
      x: (clientX - rect.left) / canvasScale,
      y: (clientY - rect.top) / canvasScale,
    }
  }

  const handleCanvasPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY)
    const clickedElement = getElementAtPosition(x, y)

    if (tool === "select" && clickedElement) {
      setSelectedElement(clickedElement)
      setIsDragging(true)
      setDragOffset({
        x: x - clickedElement.x,
        y: y - clickedElement.y,
      })
      if ("vibrate" in navigator) {
        navigator.vibrate(10) // Short haptic feedback on element selection/drag start
      }
    } else if (tool === "text" && !clickedElement) {
      const newElement: TemplateElement = {
        id: `element-${Date.now()}`,
        type: "text",
        content: "New Text",
        x,
        y,
        fontSize: 16,
        fontFamily: "serif",
        color: "#000000",
      }
      setElements([...elements, newElement])
      setSelectedElement(newElement)
      setTool("select")
    } else if (!clickedElement) {
      setSelectedElement(null)
    }
  }

  const handleCanvasPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return
    event.preventDefault()

    const { x, y } = getCanvasCoordinates(event.clientX, event.clientY)
    const newX = x - dragOffset.x
    const newY = y - dragOffset.y

    updateSelectedElement({ x: newX, y: newY })
    if ("vibrate" in navigator) {
      navigator.vibrate(1) // Very short haptic feedback during drag
    }
  }

  const handleCanvasPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleCanvasTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    const touch = event.touches[0]
    const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY)
    const clickedElement = getElementAtPosition(x, y)

    if (tool === "select" && clickedElement) {
      setSelectedElement(clickedElement)
      setIsDragging(true)
      setDragOffset({
        x: x - clickedElement.x,
        y: y - clickedElement.y,
      })
      if ("vibrate" in navigator) {
        navigator.vibrate(10) // Short haptic feedback on element selection/drag start
      }
    } else if (tool === "text" && !clickedElement) {
      const newElement: TemplateElement = {
        id: `element-${Date.now()}`,
        type: "text",
        content: "New Text",
        x,
        y,
        fontSize: 16,
        fontFamily: "serif",
        color: "#000000",
      }
      setElements([...elements, newElement])
      setSelectedElement(newElement)
      setTool("select")
    } else if (!clickedElement) {
      setSelectedElement(null)
    }
  }

  const handleCanvasTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedElement) return
    event.preventDefault()

    const touch = event.touches[0]
    const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY)
    const newX = x - dragOffset.x
    const newY = y - dragOffset.y

    updateSelectedElement({ x: newX, y: newY })
    if ("vibrate" in navigator) {
      navigator.vibrate(1) // Very short haptic feedback during drag
    }
  }

  const handleCanvasTouchEnd = (event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault()
    setIsDragging(false)
    setDragOffset({ x: 0, y: 0 })
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (src) {
        loadImage(src).then(() => {
          const newElement: TemplateElement = {
            id: `element-${Date.now()}`,
            type: "image",
            content: file.name,
            x: canvasSize.width / 2,
            y: canvasSize.height / 2,
            width: 150,
            height: 150,
            src: src,
          }
          setElements([...elements, newElement])
          setSelectedElement(newElement)
          setTool("select")
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const updateSelectedElement = (updates: Partial<TemplateElement>) => {
    if (!selectedElement) return

    const updatedElement = { ...selectedElement, ...updates }
    setElements(elements.map((el) => (el.id === selectedElement.id ? updatedElement : el)))
    setSelectedElement(updatedElement)
  }

  const deleteSelectedElement = () => {
    if (!selectedElement) return
    setElements(elements.filter((el) => el.id !== selectedElement.id))
    setSelectedElement(null)
  }

  const duplicateSelectedElement = () => {
    if (!selectedElement) return
    const newElement = {
      ...selectedElement,
      id: `element-${Date.now()}`,
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
  }

  const exportDesign = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      await trackEvent({
        event: "invitation_exported",
        userId: user?.id,
        data: {
          templateId: template.id,
          templateName: template.name,
          elementCount: elements.length,
        },
      })

      const link = document.createElement("a")
      link.download = `wedding-invitation-${template.name.toLowerCase().replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    } catch (error) {
      console.error("Export tracking error:", error)
      const link = document.createElement("a")
      link.download = `wedding-invitation-${template.name.toLowerCase().replace(/\s+/g, "-")}.png`
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  const saveDesign = async () => {
    if (!user) {
      toast({
        title: "Giriş Gerekli",
        description: "Projeyi kaydetmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const projectData = {
        title: `${template.name} - ${new Date().toLocaleDateString("tr-TR")}`,
        type: "invitation" as const,
        templateId: template.id,
        elements: elements,
        userId: user.id,
      }

      let response
      if (projectId) {
        response = await updateProject(projectId, projectData)
      } else {
        response = await saveProject(projectData)
        setProjectId(response.id)
      }

      await trackEvent({
        event: "invitation_saved",
        userId: user.id,
        data: {
          projectId: response.id,
          templateId: template.id,
          templateName: template.name,
          elementCount: elements.length,
        },
      })

      toast({
        title: "Başarılı!",
        description: "Tasarımınız kaydedildi.",
      })
    } catch (error) {
      console.error("Save error:", error)
      toast({
        title: "Hata",
        description: "Tasarım kaydedilirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addShape = (shapeType: string) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type: "shape",
      content: shapeType,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      width: 100,
      height: 100,
      shapeType: shapeType,
      fillColor: "#f3f4f6",
      borderColor: "#000000",
      borderWidth: 2,
      borderStyle: "solid",
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setTool("select")
    setShowMobileMenu(false)
  }

  const addBorder = () => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type: "border",
      content: "Border",
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      width: 200,
      height: 150,
      borderWidth: 2,
      borderColor: "#000000",
      borderStyle: "solid",
      borderRadius: 0,
      color: "transparent",
    }
    setElements([...elements, newElement])
    setSelectedElement(newElement)
    setTool("select")
    setShowMobileMenu(false)
  }

  const shapes = [
    { name: "Rectangle", type: "rectangle", icon: Square },
    { name: "Circle", type: "circle", icon: Circle },
    { name: "Ellipse", type: "ellipse", icon: Circle },
    { name: "Triangle", type: "triangle", icon: Triangle },
    { name: "Diamond", type: "diamond", icon: Diamond },
    { name: "Heart", type: "heart", icon: Heart },
    { name: "Star", type: "star", icon: Star },
    { name: "Hexagon", type: "hexagon", icon: Square },
  ]

  const ToolButton = ({
    isActive,
    onClick,
    icon: Icon,
    label,
    className = "",
  }: {
    isActive: boolean
    onClick: () => void
    icon: React.ComponentType<{ className?: string }>
    label: string
    className?: string
  }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      className={`flex-1 sm:flex-none sm:w-12 sm:h-12 h-10 ${className}`}
      title={label}
    >
      <Icon className="h-4 w-4" />
      <span className="ml-2 sm:hidden">{label}</span>
    </Button>
  )

  const PropertiesPanel = () => (
    <div className="space-y-4">
      {selectedElement ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={duplicateSelectedElement}
              className="flex-1 sm:flex-none bg-transparent"
            >
              <Copy className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Copy</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={deleteSelectedElement}
              className="flex-1 sm:flex-none bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              <span className="ml-2 sm:hidden">Delete</span>
            </Button>
          </div>

          {selectedElement.type === "text" && (
            <>
              <div>
                <Label htmlFor="text-content">Text Content</Label>
                <Input
                  id="text-content"
                  value={selectedElement.content}
                  onChange={(e) => updateSelectedElement({ content: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="font-family">Font Family</Label>
                <Select
                  value={selectedElement.fontFamily}
                  onValueChange={(value) => updateSelectedElement({ fontFamily: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="sans-serif">Sans Serif</SelectItem>
                    <SelectItem value="cursive">Cursive</SelectItem>
                    <SelectItem value="monospace">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-size">Font Size: {selectedElement.fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={8}
                  max={72}
                  step={1}
                  value={[selectedElement.fontSize || 16]}
                  onValueChange={([value]) => updateSelectedElement({ fontSize: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="text-color">Text Color</Label>
                <Input
                  id="text-color"
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateSelectedElement({ color: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label>Text Style</Label>
                <div className="flex gap-1 mt-2">
                  <Button
                    variant={selectedElement.bold ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ bold: !selectedElement.bold })}
                    className="flex-1"
                  >
                    <Bold className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.italic ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ italic: !selectedElement.italic })}
                    className="flex-1"
                  >
                    <Italic className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.underline ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ underline: !selectedElement.underline })}
                    className="flex-1"
                  >
                    <Underline className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Text Alignment</Label>
                <div className="flex gap-1 mt-2">
                  <Button
                    variant={selectedElement.align === "left" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ align: "left" })}
                    className="flex-1"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.align === "center" || !selectedElement.align ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ align: "center" })}
                    className="flex-1"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedElement.align === "right" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateSelectedElement({ align: "right" })}
                    className="flex-1"
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}

          {selectedElement.type === "image" && (
            <>
              <div>
                <Label htmlFor="image-name">Image Name</Label>
                <Input
                  id="image-name"
                  value={selectedElement.content}
                  onChange={(e) => updateSelectedElement({ content: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="image-width">Width: {selectedElement.width}px</Label>
                <Slider
                  id="image-width"
                  min={50}
                  max={300}
                  step={5}
                  value={[selectedElement.width || 100]}
                  onValueChange={([value]) => updateSelectedElement({ width: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="image-height">Height: {selectedElement.height}px</Label>
                <Slider
                  id="image-height"
                  min={50}
                  max={300}
                  step={5}
                  value={[selectedElement.height || 100]}
                  onValueChange={([value]) => updateSelectedElement({ height: value })}
                  className="mt-2"
                />
              </div>
            </>
          )}

          {selectedElement.type === "shape" && (
            <>
              <div>
                <Label htmlFor="shape-type">Shape Type</Label>
                <Select
                  value={selectedElement.shapeType}
                  onValueChange={(value) => updateSelectedElement({ shapeType: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {shapes.map((shape) => (
                      <SelectItem key={shape.type} value={shape.type}>
                        {shape.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fill-color">Fill Color</Label>
                <Input
                  id="fill-color"
                  type="color"
                  value={selectedElement.fillColor || "#f3f4f6"}
                  onChange={(e) => updateSelectedElement({ fillColor: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label htmlFor="border-color">Border Color</Label>
                <Input
                  id="border-color"
                  type="color"
                  value={selectedElement.borderColor || "#000000"}
                  onChange={(e) => updateSelectedElement({ borderColor: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label htmlFor="border-width">Border Width: {selectedElement.borderWidth}px</Label>
                <Slider
                  id="border-width"
                  min={0}
                  max={20}
                  step={1}
                  value={[selectedElement.borderWidth || 2]}
                  onValueChange={([value]) => updateSelectedElement({ borderWidth: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shape-width">Width: {selectedElement.width}px</Label>
                <Slider
                  id="shape-width"
                  min={20}
                  max={300}
                  step={5}
                  value={[selectedElement.width || 100]}
                  onValueChange={([value]) => updateSelectedElement({ width: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="shape-height">Height: {selectedElement.height}px</Label>
                <Slider
                  id="shape-height"
                  min={20}
                  max={300}
                  step={5}
                  value={[selectedElement.height || 100]}
                  onValueChange={([value]) => updateSelectedElement({ height: value })}
                  className="mt-2"
                />
              </div>
            </>
          )}

          {selectedElement.type === "border" && (
            <>
              <div>
                <Label htmlFor="border-width">Border Width: {selectedElement.borderWidth}px</Label>
                <Slider
                  id="border-width"
                  min={1}
                  max={20}
                  step={1}
                  value={[selectedElement.borderWidth || 2]}
                  onValueChange={([value]) => updateSelectedElement({ borderWidth: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="border-color">Border Color</Label>
                <Input
                  id="border-color"
                  type="color"
                  value={selectedElement.borderColor || "#000000"}
                  onChange={(e) => updateSelectedElement({ borderColor: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label htmlFor="fill-color">Fill Color</Label>
                <Input
                  id="fill-color"
                  type="color"
                  value={selectedElement.color || "#ffffff"}
                  onChange={(e) => updateSelectedElement({ color: e.target.value })}
                  className="mt-1 h-10"
                />
              </div>

              <div>
                <Label htmlFor="border-radius">Corner Radius: {selectedElement.borderRadius}px</Label>
                <Slider
                  id="border-radius"
                  min={0}
                  max={50}
                  step={1}
                  value={[selectedElement.borderRadius || 0]}
                  onValueChange={([value]) => updateSelectedElement({ borderRadius: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="border-width-control">Width: {selectedElement.width}px</Label>
                <Slider
                  id="border-width-control"
                  min={50}
                  max={350}
                  step={5}
                  value={[selectedElement.width || 200]}
                  onValueChange={([value]) => updateSelectedElement({ width: value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="border-height-control">Height: {selectedElement.height}px</Label>
                <Slider
                  id="border-height-control"
                  min={50}
                  max={350}
                  step={5}
                  value={[selectedElement.height || 150]}
                  onValueChange={([value]) => updateSelectedElement({ height: value })}
                  className="mt-2"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="pos-x">X Position</Label>
              <Input
                id="pos-x"
                type="number"
                value={selectedElement.x}
                onChange={(e) => updateSelectedElement({ x: Number.parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="pos-y">Y Position</Label>
              <Input
                id="pos-y"
                type="number"
                value={selectedElement.y}
                onChange={(e) => updateSelectedElement({ y: Number.parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>
        </>
      ) : (
        <div className="text-center text-gray-500 py-8">
          <Type className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an element to edit its properties</p>
          <p className="text-sm mt-2">Tap and drag to move elements</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button variant="ghost" size="sm" onClick={onBack} className="flex-shrink-0">
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">Back</span>
            </Button>
            <Separator orientation="vertical" className="h-6 hidden sm:block" />
            <div className="min-w-0">
              <h1 className="text-sm sm:text-lg font-semibold truncate">
                <span className="hidden sm:inline">Editing: </span>
                {template.name}
              </h1>
              <Badge variant="secondary" className="hidden sm:inline-flex mt-1">
                {template.category}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Button variant="outline" size="sm" className="hidden md:flex bg-transparent" disabled>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="hidden md:flex bg-transparent" disabled>
              <Redo className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-6 hidden md:block" />

            <Button variant="outline" size="sm" onClick={saveDesign} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              <span className="hidden sm:inline ml-2">{isSaving ? "Saving..." : "Save"}</span>
            </Button>

            <Button onClick={exportDesign} size="sm" variant="outline">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Export</span>
            </Button>

            {/* Shopping Cart */}
            <ShoppingCartComponent
              items={user ? cartItems : []}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckout}
              user={user}
            />

            {/* Product Configurator */}
            <ProductConfigurator
              templateName={template.name}
              onAddToCart={handleAddToCart}
              onDirectPurchase={handleDirectPurchase}
              user={user}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-16 bg-white border-r border-gray-200 flex-col items-center py-4 gap-2">
          <ToolButton
            isActive={tool === "select"}
            onClick={() => setTool("select")}
            icon={() => <div className="w-4 h-4 border border-current" />}
            label="Select"
          />
          <ToolButton isActive={tool === "text"} onClick={() => setTool("text")} icon={Type} label="Text" />
          <ToolButton isActive={false} onClick={() => fileInputRef.current?.click()} icon={ImageIcon} label="Image" />
          <ToolButton isActive={false} onClick={() => addShape("rectangle")} icon={Square} label="Shape" />
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Toolbar */}
          <div className="lg:hidden bg-white border-b border-gray-200 p-2">
            <div className="flex gap-2 overflow-x-auto">
              <ToolButton isActive={tool === "select"} onClick={() => setTool("select")} icon={Move} label="Select" />
              <ToolButton isActive={tool === "text"} onClick={() => setTool("text")} icon={Type} label="Text" />
              <ToolButton
                isActive={false}
                onClick={() => fileInputRef.current?.click()}
                icon={ImageIcon}
                label="Image"
              />
              <ToolButton isActive={false} onClick={() => addShape("rectangle")} icon={Square} label="Shape" />

              {/* Mobile Menu Button */}
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                    <Plus className="h-4 w-4" />
                    <span className="ml-2">More</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Tools & Properties</SheetTitle>
                  </SheetHeader>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tools">Tools</TabsTrigger>
                      <TabsTrigger value="properties">Properties</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tools" className="mt-4">
                      <ScrollArea className="h-[60vh]">
                        <div className="space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start bg-transparent"
                            onClick={() => {
                              fileInputRef.current?.click()
                              setShowMobileMenu(false)
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>

                          <div className="space-y-2">
                            <Label>Add Shapes</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {shapes.map((shape) => (
                                <Button
                                  key={shape.type}
                                  variant="outline"
                                  onClick={() => addShape(shape.type)}
                                  className="justify-start"
                                >
                                  <shape.icon className="mr-2 h-4 w-4" />
                                  {shape.name}
                                </Button>
                              ))}
                            </div>
                          </div>

                          <Button variant="outline" onClick={addBorder} className="w-full justify-start bg-transparent">
                            <Circle className="h-4 w-4 mr-2" />
                            Add Border
                          </Button>
                        </div>
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="properties" className="mt-4">
                      <ScrollArea className="h-[60vh]">
                        <PropertiesPanel />
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Canvas Container */}
          <div className="flex-1 flex overflow-hidden">
            <div
              ref={containerRef}
              className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto bg-gray-100"
            >
              <div className="bg-white rounded-lg shadow-lg p-2 sm:p-4">
                <canvas
                  ref={canvasRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  onPointerDown={handleCanvasPointerDown}
                  onPointerMove={handleCanvasPointerMove}
                  onPointerUp={handleCanvasPointerUp}
                  onPointerLeave={handleCanvasPointerUp}
                  onTouchStart={handleCanvasTouchStart}
                  onTouchMove={handleCanvasTouchMove}
                  onTouchEnd={handleCanvasTouchEnd}
                  className="border border-gray-300 cursor-crosshair touch-none max-w-full max-h-full"
                  style={{
                    cursor: isDragging ? "grabbing" : tool === "select" ? "grab" : "crosshair",
                    touchAction: "none",
                    transform: `scale(${canvasScale})`,
                    transformOrigin: "center center",
                  }}
                />
              </div>
            </div>

            {/* Desktop Properties Panel */}
            <div className="hidden lg:block w-80 bg-white border-l border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Properties</h3>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="p-4">
                  <PropertiesPanel />

                  <Separator className="my-6" />

                  <div>
                    <h4 className="font-medium mb-3">Quick Actions</h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                            <Square className="h-4 w-4 mr-2" />
                            Add Shape
                            <ChevronDown className="h-4 w-4 ml-auto" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                          {shapes.map((shape) => (
                            <DropdownMenuItem
                              key={shape.type}
                              onClick={() => addShape(shape.type)}
                              className="cursor-pointer"
                            >
                              <shape.icon className="mr-2 h-4 w-4" />
                              {shape.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addBorder}
                        className="w-full justify-start bg-transparent"
                      >
                        <Circle className="h-4 w-4 mr-2" />
                        Add Border
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setTool("text")}
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Add Text Block
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />
    </div>
  )
}
