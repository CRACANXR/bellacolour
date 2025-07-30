"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ShoppingCart, Plus, Minus, Trash2, UserIcon, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthModal } from "@/components/auth/auth-modal"
import type { CartItem } from "@/lib/shopping-types"
import type { AuthUser } from "@/contexts/auth-context"

interface ShoppingCartProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onCheckout: () => void
  user: AuthUser | null
}

export function ShoppingCartComponent({ items, onUpdateQuantity, onRemoveItem, onCheckout, user }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { toast } = useToast()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const shipping = items.some((item) => item.type === "printed") ? 15 : 0
  const total = subtotal + tax + shipping

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (items.length === 0) {
      toast({
        title: "Sepet Boş",
        description: "Sepetinizde ürün bulunmuyor.",
        variant: "destructive",
      })
      return
    }

    onCheckout()
    setIsOpen(false)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    toast({
      title: "Giriş Başarılı!",
      description: "Artık alışveriş yapabilirsiniz.",
    })
  }

  const handleQuantityChange = (itemId: string, change: number) => {
    const item = items.find((i) => i.id === itemId)
    if (!item) return

    const newQuantity = Math.max(1, item.quantity + change)
    onUpdateQuantity(itemId, newQuantity)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="relative bg-transparent">
            <ShoppingCart className="h-4 w-4" />
            {user ? (
              <>
                <span className="hidden sm:inline ml-2">Sepet</span>
                {items.length > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {items.length}
                  </Badge>
                )}
              </>
            ) : (
              <span className="hidden sm:inline ml-2">Giriş</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Alışveriş Sepeti
            </DialogTitle>
          </DialogHeader>

          {!user ? (
            <div className="text-center py-8">
              <UserIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Giriş Gerekli</h3>
              <p className="text-gray-600 mb-4">Sepetinizi görüntülemek için giriş yapmanız gerekiyor.</p>
              <Button onClick={() => setShowAuthModal(true)} className="bg-rose-600 hover:bg-rose-700">
                Giriş Yap
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Sepetiniz Boş</h3>
              <p className="text-gray-600">
                Henüz sepetinizde ürün bulunmuyor. Tasarımlarınızı tamamlayıp satın alabilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <ScrollArea className="max-h-96">
                <div className="space-y-4">
                  {items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={item.type === "digital" ? "secondary" : "default"}>
                                {item.type === "digital" ? "Dijital" : "Basılı"}
                              </Badge>
                              {item.dimensions && <span className="text-sm text-gray-500">{item.dimensions}</span>}
                            </div>
                            {item.paperType && <p className="text-sm text-gray-500 mt-1">Kağıt: {item.paperType}</p>}
                            {item.finishing && <p className="text-sm text-gray-500">Bitirme: {item.finishing}</p>}
                            {item.urgentDelivery && (
                              <Badge variant="destructive" className="mt-1">
                                Acil Teslimat
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₺{(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">₺{(item.price / item.quantity).toFixed(2)} / adet</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button variant="outline" size="sm" onClick={() => handleQuantityChange(item.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Ara Toplam</span>
                  <span>₺{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>KDV (%18)</span>
                  <span>₺{tax.toFixed(2)}</span>
                </div>
                {shipping > 0 && (
                  <div className="flex justify-between">
                    <span>Kargo</span>
                    <span>₺{shipping.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Toplam</span>
                  <span>₺{total.toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} className="w-full bg-rose-600 hover:bg-rose-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Ödemeye Geç (₺{total.toFixed(2)})
              </Button>

              {shipping === 0 && subtotal < 200 && (
                <p className="text-sm text-center text-gray-500">200₺ üzeri siparişlerde ücretsiz kargo!</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </>
  )
}
