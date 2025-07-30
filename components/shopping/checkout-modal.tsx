"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Truck, User, MapPin, CheckCircle, ArrowLeft, ArrowRight, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import type { CartItem, ShippingAddress, PaymentInfo, Order } from "@/lib/shopping-types"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  onOrderComplete: (order: Order) => void
}

export function CheckoutModal({ isOpen, onClose, items, onOrderComplete }: CheckoutModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Türkiye",
    phone: "",
  })
  const [billingAddress, setBillingAddress] = useState<ShippingAddress | null>(null)
  const [useSameAddress, setUseSameAddress] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const { toast } = useToast()
  const { user } = useAuth()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.18
  const shipping = items.some((item) => item.type === "printed") ? 15 : 0
  const total = subtotal + tax + shipping

  const steps = [
    { id: 0, title: "Müşteri Bilgileri", icon: User },
    { id: 1, title: "Teslimat Adresi", icon: MapPin },
    { id: 2, title: "Ödeme Bilgileri", icon: CreditCard },
    { id: 3, title: "Sipariş Özeti", icon: Package },
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleCompleteOrder = async () => {
    if (!user) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const order: Order = {
        id: `ORDER-${Date.now()}`,
        userId: user.id,
        items,
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress,
        billingAddress: useSameAddress ? shippingAddress : billingAddress || shippingAddress,
        paymentInfo: {
          cardholderName: paymentInfo.cardholderName,
          cardNumber: `****-****-****-${paymentInfo.cardNumber.slice(-4)}`,
        },
        status: "processing",
        createdAt: new Date().toISOString(),
        estimatedDelivery: items.some((item) => item.urgentDelivery)
          ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }

      onOrderComplete(order)
      onClose()

      toast({
        title: "Sipariş Tamamlandı!",
        description: `Sipariş numaranız: ${order.id}`,
      })
    } catch (error) {
      toast({
        title: "Hata",
        description: "Sipariş işlenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return true // Customer info is from auth context
      case 1:
        return (
          shippingAddress.firstName &&
          shippingAddress.lastName &&
          shippingAddress.address &&
          shippingAddress.city &&
          shippingAddress.zipCode &&
          shippingAddress.phone
        )
      case 2:
        return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardholderName
      case 3:
        return true
      default:
        return false
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Sipariş Tamamla
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Steps Navigation */}
          <div className="lg:w-1/4">
            <div className="space-y-2">
              {steps.map((step, index) => {
                const StepIcon = step.icon
                const isActive = currentStep === index
                const isCompleted = currentStep > index
                const isValid = isStepValid(index)

                return (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isActive
                        ? "bg-rose-50 border-2 border-rose-200"
                        : isCompleted
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-gray-50 border-2 border-gray-200"
                    }`}
                    onClick={() => setCurrentStep(index)}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        isActive
                          ? "bg-rose-600 text-white"
                          : isCompleted
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                      }`}
                    >
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : <StepIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          isActive ? "text-rose-600" : isCompleted ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        {step.title}
                      </p>
                      {!isValid && currentStep > index && <p className="text-xs text-red-500">Eksik bilgi</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="lg:w-1/2 flex-1">
            <ScrollArea className="h-[400px]">
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Müşteri Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ad</Label>
                        <Input value={user?.name?.split(" ")[0] || ""} disabled />
                      </div>
                      <div>
                        <Label>Soyad</Label>
                        <Input value={user?.name?.split(" ").slice(1).join(" ") || ""} disabled />
                      </div>
                    </div>
                    <div>
                      <Label>E-posta</Label>
                      <Input value={user?.email || ""} disabled />
                    </div>
                    <p className="text-sm text-gray-500">
                      Bilgilerinizi güncellemek için profil ayarlarınızı kullanın.
                    </p>
                  </CardContent>
                </Card>
              )}

              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Teslimat Adresi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Ad *</Label>
                        <Input
                          value={shippingAddress.firstName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                          placeholder="Adınız"
                        />
                      </div>
                      <div>
                        <Label>Soyad *</Label>
                        <Input
                          value={shippingAddress.lastName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                          placeholder="Soyadınız"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Şirket</Label>
                      <Input
                        value={shippingAddress.company}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, company: e.target.value })}
                        placeholder="Şirket adı (opsiyonel)"
                      />
                    </div>
                    <div>
                      <Label>Adres *</Label>
                      <Input
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                        placeholder="Tam adresiniz"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Şehir *</Label>
                        <Input
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                          placeholder="Şehir"
                        />
                      </div>
                      <div>
                        <Label>Posta Kodu *</Label>
                        <Input
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          placeholder="Posta kodu"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Telefon *</Label>
                      <Input
                        value={shippingAddress.phone}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                        placeholder="Telefon numaranız"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Ödeme Bilgileri
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Kart Sahibinin Adı *</Label>
                      <Input
                        value={paymentInfo.cardholderName}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardholderName: e.target.value })}
                        placeholder="Kart üzerindeki isim"
                      />
                    </div>
                    <div>
                      <Label>Kart Numarası *</Label>
                      <Input
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Son Kullanma Tarihi *</Label>
                        <Input
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label>CVV *</Label>
                        <Input
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                          placeholder="123"
                          maxLength={4}
                          type="password"
                        />
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        🔒 Ödeme bilgileriniz SSL ile şifrelenir ve güvenli bir şekilde işlenir.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Sipariş Özeti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={item.type === "digital" ? "secondary" : "default"}>
                                {item.type === "digital" ? "Dijital" : "Basılı"}
                              </Badge>
                              {item.dimensions && <span className="text-sm text-gray-500">{item.dimensions}</span>}
                            </div>
                            {item.paperType && <p className="text-sm text-gray-500">Kağıt: {item.paperType}</p>}
                            {item.finishing && <p className="text-sm text-gray-500">Bitim: {item.finishing}</p>}
                            <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₺{(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>

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

                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Tahmini teslimat: {items.some((item) => item.urgentDelivery) ? "1-2 iş günü" : "3-7 iş günü"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </ScrollArea>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-0">
              <CardHeader>
                <CardTitle className="text-lg">Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ara Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>KDV</span>
                    <span>₺{tax.toFixed(2)}</span>
                  </div>
                  {shipping > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Kargo</span>
                      <span>₺{shipping.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Toplam</span>
                    <span>₺{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentStep > 0 && (
                    <Button variant="outline" onClick={handlePrevious} className="w-full bg-transparent">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Geri
                    </Button>
                  )}

                  {currentStep < steps.length - 1 ? (
                    <Button onClick={handleNext} disabled={!isStepValid(currentStep)} className="w-full">
                      İleri
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCompleteOrder}
                      disabled={!isStepValid(currentStep) || isProcessing}
                      className="w-full"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          İşleniyor...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Siparişi Tamamla
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
