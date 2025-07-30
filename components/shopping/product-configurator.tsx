"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ShoppingCart, CreditCard, Download, Printer, Zap, Package, Truck, Star, Info, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthModal } from "@/components/auth/auth-modal"
import type { CartItem } from "@/lib/shopping-types"
import type { AuthUser } from "@/contexts/auth-context"

interface ProductConfiguratorProps {
  templateName: string
  onAddToCart: (item: CartItem) => void
  onDirectPurchase: (item: CartItem) => void
  user: AuthUser | null
}

export function ProductConfigurator({ templateName, onAddToCart, onDirectPurchase, user }: ProductConfiguratorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState("digital")

  // Digital product config
  const [digitalConfig, setDigitalConfig] = useState({
    format: "pdf",
    resolution: "high",
    socialMedia: true,
  })

  // Printed product config
  const [printedConfig, setPrintedConfig] = useState({
    size: "13x18",
    paperType: "premium-matte",
    finishing: "none",
    quantity: 50,
    urgentDelivery: false,
  })

  const { toast } = useToast()

  // Pricing configuration
  const digitalPrice = 49.99

  const paperMultipliers = {
    standard: 1.0,
    "premium-matte": 1.3,
    "premium-glossy": 1.3,
    "luxury-textured": 1.8,
    pearl: 2.2,
  }

  const finishingMultipliers = {
    none: 1.0,
    "uv-coating": 1.4,
    "gold-foil": 1.8,
    "silver-foil": 1.8,
    embossing: 2.0,
  }

  const sizeMultipliers = {
    "10x15": 1.0,
    "13x18": 1.2,
    "15x21": 1.5,
    "20x30": 2.0,
  }

  const quantityDiscounts = {
    25: 1.0,
    50: 0.9,
    100: 0.8,
    200: 0.7,
    500: 0.5,
  }

  const calculatePrintedPrice = () => {
    const basePrice = 2.5
    const sizeMultiplier = sizeMultipliers[printedConfig.size as keyof typeof sizeMultipliers] || 1.0
    const paperMultiplier = paperMultipliers[printedConfig.paperType as keyof typeof paperMultipliers] || 1.0
    const finishingMultiplier =
      finishingMultipliers[printedConfig.finishing as keyof typeof finishingMultipliers] || 1.0
    const quantityDiscount = quantityDiscounts[printedConfig.quantity as keyof typeof quantityDiscounts] || 1.0
    const urgentMultiplier = printedConfig.urgentDelivery ? 1.5 : 1.0

    const unitPrice = basePrice * sizeMultiplier * paperMultiplier * finishingMultiplier * urgentMultiplier
    const totalPrice = unitPrice * printedConfig.quantity * quantityDiscount

    return {
      unitPrice,
      totalPrice,
      savings: printedConfig.quantity > 25 ? unitPrice * printedConfig.quantity - totalPrice : 0,
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const item: CartItem =
      activeTab === "digital"
        ? {
            id: `digital-${Date.now()}`,
            title: `${templateName} - Dijital Davetiye`,
            type: "digital",
            quantity: 1,
            price: digitalPrice,
          }
        : {
            id: `printed-${Date.now()}`,
            title: `${templateName} - Basılı Davetiye`,
            type: "printed",
            quantity: printedConfig.quantity,
            price: calculatePrintedPrice().totalPrice,
            dimensions: printedConfig.size.replace("x", " x ") + " cm",
            paperType: getPaperTypeName(printedConfig.paperType),
            finishing: getFinishingName(printedConfig.finishing),
            urgentDelivery: printedConfig.urgentDelivery,
          }

    onAddToCart(item)
    setIsOpen(false)

    toast({
      title: "Sepete Eklendi!",
      description: `${item.title} sepetinize eklendi.`,
    })
  }

  const handleDirectPurchase = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    const item: CartItem =
      activeTab === "digital"
        ? {
            id: `digital-${Date.now()}`,
            title: `${templateName} - Dijital Davetiye`,
            type: "digital",
            quantity: 1,
            price: digitalPrice,
          }
        : {
            id: `printed-${Date.now()}`,
            title: `${templateName} - Basılı Davetiye`,
            type: "printed",
            quantity: printedConfig.quantity,
            price: calculatePrintedPrice().totalPrice,
            dimensions: printedConfig.size.replace("x", " x ") + " cm",
            paperType: getPaperTypeName(printedConfig.paperType),
            finishing: getFinishingName(printedConfig.finishing),
            urgentDelivery: printedConfig.urgentDelivery,
          }

    onDirectPurchase(item)
    setIsOpen(false)
  }

  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    // The user state will be updated by the auth context
    toast({
      title: "Giriş Başarılı!",
      description: "Artık alışveriş yapabilirsiniz.",
    })
  }

  const getPaperTypeName = (type: string) => {
    const names = {
      standard: "Standart",
      "premium-matte": "Premium Mat",
      "premium-glossy": "Premium Parlak",
      "luxury-textured": "Lüks Dokulu",
      pearl: "İnci",
    }
    return names[type as keyof typeof names] || type
  }

  const getFinishingName = (finishing: string) => {
    const names = {
      none: "Yok",
      "uv-coating": "UV Kaplama",
      "gold-foil": "Altın Varak",
      "silver-foil": "Gümüş Varak",
      embossing: "Kabartma",
    }
    return names[finishing as keyof typeof names] || finishing
  }

  const printedPrice = calculatePrintedPrice()

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-rose-600 hover:bg-rose-700">
            {user ? (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Satın Al
              </>
            ) : (
              <>
                <Button className="h-4 w-4 mr-2 bg-rose-600 hover:bg-rose-700">Giriş Yap</Button>
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {templateName} - Ürün Seçenekleri
            </DialogTitle>
          </DialogHeader>

          {!user ? (
            <div className="text-center py-8">
              <Button className="h-16 w-16 mx-auto mb-4 text-gray-400 bg-transparent">Kullanıcı</Button>
              <h3 className="text-xl font-semibold mb-2">Giriş Gerekli</h3>
              <p className="text-gray-600 mb-4">Ürün satın almak için giriş yapmanız gerekiyor.</p>
              <Button onClick={() => setShowAuthModal(true)} className="bg-rose-600 hover:bg-rose-700">
                Giriş Yap
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Configuration */}
              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="digital" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Dijital
                    </TabsTrigger>
                    <TabsTrigger value="printed" className="flex items-center gap-2">
                      <Printer className="h-4 w-4" />
                      Basılı
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="digital" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Download className="h-5 w-5" />
                          Dijital Davetiye
                          <Badge variant="secondary">Anında İndirme</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Dosya Formatı</Label>
                            <Select
                              value={digitalConfig.format}
                              onValueChange={(value) => setDigitalConfig({ ...digitalConfig, format: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pdf">PDF (Yazdırma için ideal)</SelectItem>
                                <SelectItem value="jpg">JPG (Sosyal medya için)</SelectItem>
                                <SelectItem value="both">Her ikisi</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Çözünürlük</Label>
                            <Select
                              value={digitalConfig.resolution}
                              onValueChange={(value) => setDigitalConfig({ ...digitalConfig, resolution: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">Yüksek (300 DPI)</SelectItem>
                                <SelectItem value="web">Web (72 DPI)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="social-media"
                            checked={digitalConfig.socialMedia}
                            onCheckedChange={(checked) => setDigitalConfig({ ...digitalConfig, socialMedia: checked })}
                          />
                          <Label htmlFor="social-media">Sosyal medya boyutları dahil</Label>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900">Dijital Paket İçeriği:</h4>
                              <ul className="text-sm text-blue-800 mt-2 space-y-1">
                                <li>• Yüksek çözünürlüklü dosyalar (300 DPI)</li>
                                <li>• Yazdırma için optimize edilmiş PDF</li>
                                <li>• Sosyal medya boyutları (Instagram, Facebook)</li>
                                <li>• Anında indirme</li>
                                <li>• Ömür boyu erişim</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="printed" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Printer className="h-5 w-5" />
                          Basılı Davetiye
                          <Badge variant="default">Profesyonel Baskı</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Boyut</Label>
                            <Select
                              value={printedConfig.size}
                              onValueChange={(value) => setPrintedConfig({ ...printedConfig, size: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10x15">10 x 15 cm (Standart)</SelectItem>
                                <SelectItem value="13x18">13 x 18 cm (Popüler)</SelectItem>
                                <SelectItem value="15x21">15 x 21 cm (A5)</SelectItem>
                                <SelectItem value="20x30">20 x 30 cm (Büyük)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label>Kağıt Türü</Label>
                            <Select
                              value={printedConfig.paperType}
                              onValueChange={(value) => setPrintedConfig({ ...printedConfig, paperType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="standard">Standart (300gsm)</SelectItem>
                                <SelectItem value="premium-matte">Premium Mat (350gsm)</SelectItem>
                                <SelectItem value="premium-glossy">Premium Parlak (350gsm)</SelectItem>
                                <SelectItem value="luxury-textured">Lüks Dokulu (400gsm)</SelectItem>
                                <SelectItem value="pearl">İnci Kağıt (350gsm)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label>Bitirme Seçenekleri</Label>
                          <Select
                            value={printedConfig.finishing}
                            onValueChange={(value) => setPrintedConfig({ ...printedConfig, finishing: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Standart Bitirme</SelectItem>
                              <SelectItem value="uv-coating">UV Kaplama (+%40)</SelectItem>
                              <SelectItem value="gold-foil">Altın Varak (+%80)</SelectItem>
                              <SelectItem value="silver-foil">Gümüş Varak (+%80)</SelectItem>
                              <SelectItem value="embossing">Kabartma (+%100)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Adet: {printedConfig.quantity}</Label>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {[25, 50, 100, 200, 500].map((qty) => (
                              <Button
                                key={qty}
                                variant={printedConfig.quantity === qty ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPrintedConfig({ ...printedConfig, quantity: qty })}
                                className="relative"
                              >
                                {qty}
                                {qty > 25 && (
                                  <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs">
                                    -
                                    {Math.round(
                                      (1 - (quantityDiscounts[qty as keyof typeof quantityDiscounts] || 1)) * 100,
                                    )}
                                    %
                                  </Badge>
                                )}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="urgent-delivery"
                            checked={printedConfig.urgentDelivery}
                            onCheckedChange={(checked) =>
                              setPrintedConfig({ ...printedConfig, urgentDelivery: checked })
                            }
                          />
                          <Label htmlFor="urgent-delivery" className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-orange-500" />
                            Acil Teslimat (1-2 iş günü) +%50
                          </Label>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <Truck className="h-5 w-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-900">Teslimat Bilgileri:</h4>
                              <ul className="text-sm text-green-800 mt-2 space-y-1">
                                <li>• Standart teslimat: 3-7 iş günü</li>
                                <li>• Acil teslimat: 1-2 iş günü</li>
                                <li>• Ücretsiz kargo (200₺ üzeri siparişlerde)</li>
                                <li>• Güvenli ambalaj</li>
                                <li>• Kargo takip numarası</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Price Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Fiyat Özeti
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {activeTab === "digital" ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span>Dijital Paket</span>
                          <span className="font-bold text-lg">₺{digitalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            Anında indirme
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            Yüksek çözünürlük
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            Sosyal medya boyutları
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Birim Fiyat</span>
                          <span>₺{printedPrice.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Adet</span>
                          <span>{printedConfig.quantity}</span>
                        </div>
                        {printedPrice.savings > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Miktar İndirimi</span>
                            <span>-₺{printedPrice.savings.toFixed(2)}</span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Toplam</span>
                          <span>₺{printedPrice.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            {getPaperTypeName(printedConfig.paperType)} kağıt
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            {printedConfig.size.replace("x", " x ")} cm boyut
                          </div>
                          <div className="flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-600" />
                            {getFinishingName(printedConfig.finishing)} bitirme
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div className="space-y-2">
                      <Button onClick={handleAddToCart} variant="outline" className="w-full bg-transparent">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Sepete Ekle
                      </Button>
                      <Button onClick={handleDirectPurchase} className="w-full bg-rose-600 hover:bg-rose-700">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Hemen Satın Al
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 text-center">Fiyatlara KDV dahildir</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />
    </>
  )
}
