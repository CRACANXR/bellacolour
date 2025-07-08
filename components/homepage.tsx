"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  Star,
  ChevronDown,
  Phone,
  Mail,
  MapPin,
  Clock,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Edit3,
  Crown,
  Palette,
  Gift,
} from "lucide-react"

interface HomepageProps {
  onNavigateToEditor: () => void
}

export default function Homepage({ onNavigateToEditor }: HomepageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // HİZMETLERİ TÜRKÇELEŞTİR
  const services = [
    {
      title: "Düğün Davetiyeleri",
      description: "Mükemmel, kişiye özel düğün davetiyeleri",
      icon: Heart,
      features: ["Özel Kaligrafi", "Premium Kağıt", "Altın Varak Seçenekleri"],
      price: "Adet 4,99₺'den başlayan fiyatlarla",
      color: "rose",
    },
    {
      title: "Save the Date Kartları",
      description: "Özel gününüzü duyurmak için zarif kartlar",
      icon: Crown,
      features: ["Uyumlu Tasarımlar", "Dijital Seçenekler", "Hızlı Teslimat"],
      price: "Adet 2,99₺'den başlayan fiyatlarla",
      color: "purple",
    },
    {
      title: "Etkinlik Kırtasiyesi",
      description: "Unutulmaz anlar için tam kırtasiye setleri",
      icon: Sparkles,
      features: ["Menü Kartları", "Yer Kartları", "Teşekkür Kartları"],
      price: "Adet 1,99₺'den başlayan fiyatlarla",
      color: "amber",
    },
    {
      title: "Özel Tasarım",
      description: "Hayalinizdeki tasarımlar size özel hazırlanır",
      icon: Palette,
      features: ["Kişisel Danışmanlık", "Sınırsız Revizyon", "Lüks Detaylar"],
      price: "299₺'den başlayan fiyatlarla",
      color: "emerald",
    },
  ]

  // ÖZELLİKLERİ TÜRKÇELEŞTİR
  const features = [
    {
      icon: Edit3,
      title: "Zarif Tasarım Stüdyosu",
      description: "Lüks şablonlar ve tipografiyle profesyonel tasarım araçları",
    },
    {
      icon: Crown,
      title: "Premium Malzemeler",
      description: "En kaliteli kağıtlar, varaklar ve özel bitişler",
    },
    {
      icon: Gift,
      title: "Özel Hizmet",
      description: "Kişisel tasarım danışmanlığı ve müşteri desteği",
    },
    {
      icon: Award,
      title: "Ödüllü Kalite",
      description: "Düğün kırtasiyesinde ödüllü tasarımlar",
    },
  ]

  // REFERANSLARI TÜRKÇELEŞTİR
  const testimonials = [
    {
      name: "İsabella & James",
      text: "Davetiyelerimiz harikaydı! Detaylara verilen önem ve kalite beklentimizin çok üzerindeydi. Misafirlerimiz hâlâ konuşuyor.",
      rating: 5,
      location: "İstanbul",
    },
    {
      name: "Sofia & Alexander",
      text: "Tasarım süreci çok kolaydı ve sonuç mükemmeldi. Bella Color lüks kırtasiye işini gerçekten biliyor.",
      rating: 5,
      location: "Ankara",
    },
    {
      name: "Charlotte & William",
      text: "Başlangıçtan teslimata kadar her şey kusursuzdu. Altın varak detaylar nefes kesiciydi.",
      rating: 5,
      location: "İzmir",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img src="/images/bella-color-logo.jpeg" alt="Bella Color" className="h-12 w-auto" />
                <div className="flex flex-col">
                  <span className="text-2xl font-serif text-gray-900 tracking-wide">Bella Color</span>
                  <span className="text-xs text-gray-500 tracking-widest uppercase">Lüks Davetiye</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#services" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  Koleksiyonlar
                </a>
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                      Tasarım Stüdyosu
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white/95 backdrop-blur-sm">
                    <DropdownMenuItem onClick={onNavigateToEditor} className="cursor-pointer p-4">
                      <Heart className="mr-3 h-5 w-5 text-rose-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Düğün Davetiyeleri</div>
                        <div className="text-sm text-gray-500">Kusursuz davetiyeni oluştur</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer p-4">
                      <Crown className="mr-3 h-5 w-5 text-purple-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Save the Date Kartları</div>
                        <div className="text-sm text-gray-500">Şık duyurular</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-4">
                      <Sparkles className="mr-3 h-5 w-5 text-amber-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Etkinlik Kırtasiyesi</div>
                        <div className="text-sm text-gray-500">Tüm setler</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <a href="#about" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  Hakkında
                </a>
                <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  İletişim
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="font-medium">
                Portföy
              </Button>
              <Button onClick={onNavigateToEditor} className="bg-rose-600 hover:bg-rose-700 font-medium">
                Tasarıma Başla
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-white to-purple-50 py-24 overflow-hidden">
        {/* Decorative background pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f1f5f9' fillOpacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl lg:text-7xl font-serif text-gray-900 mb-6 leading-tight">
                Zarif
                <span className="block text-rose-600 italic">Düğün</span>
                <span className="block">Kırtasiyesi</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Lüks tasarım stüdyomuz ile göz alıcı düğün davetiyeleri oluşturun. En önemli gününüz için her detay özenle tasarlandı.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={onNavigateToEditor}
                  className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-4 font-medium"
                >
                  Tasarıma Başla
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 font-medium border-2 bg-transparent">
                  Portföyü Gör
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start mt-12 space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10B+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Mutlu Çift</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Tasarım Ödülü</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">15</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Yıllık Deneyim</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/placeholder.svg?height=500&width=350"
                  alt="Lüks düğün davetiyesi örneği"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute -top-6 -right-6 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Yeni Koleksiyon
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border">
                  Premium Varak
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            {/* ÖZELLİKLER BÖLÜMÜ BAŞLIKLARI */}
            <h2 className="text-5xl font-serif text-gray-900 mb-6">Bella Color Farkı</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Geleneksel el işçiliğini modern tasarım teknolojisiyle birleştiriyoruz. Hikayenizi anlatan kırtasiye ürünleri tasarlıyoruz.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-rose-100 to-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-10 w-10 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            {/* KOLEKSİYONLAR BÖLÜMÜ BAŞLIKLARI */}
            <h2 className="text-5xl font-serif text-gray-900 mb-6">Koleksiyonlarımız</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hayatınızın en özel anları için özenle seçilmiş lüks kırtasiye koleksiyonlarımızı keşfedin.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 border-0 bg-white group overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full bg-${service.color}-100`}>
                      <service.icon className={`h-6 w-6 text-${service.color}-600`} />
                    </div>
                    <Badge variant="secondary" className="font-medium">
                      {service.price}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-serif">{service.title}</CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full bg-transparent border-2 hover:bg-gray-900 hover:text-white transition-colors"
                    variant="outline"
                  >
                    Koleksiyonu İncele
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            {/* REFERANSLAR BÖLÜMÜ BAŞLIKLARI */}
            <h2 className="text-5xl font-serif text-gray-900 mb-6">Aşk Hikayeleri</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En özel anlarını bize emanet eden çiftlerimizin yorumları
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-white to-rose-50">
                <CardContent className="pt-8">
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <img src="/images/bella-color-white-logo.png" alt="Bella Color" className="h-16 w-auto mb-8" />
              {/* İLETİŞİM BÖLÜMÜ BAŞLIKLARI */}
              <h2 className="text-5xl font-serif mb-8">Birlikte Güzellikler Yaratmaya Hazır mısınız?</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Kırtasiye yolculuğunuza başlamak ister misiniz? Tasarım danışmanlarımız hayallerinizi gerçeğe dönüştürmek için burada.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-rose-400 mr-4" />
                  <span className="text-lg">(555) 123-BELLA</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-rose-400 mr-4" />
                  <span className="text-lg">hello@bellacolor.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-rose-400 mr-4" />
                  <span className="text-lg">Beverly Hills Design Studio</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-rose-400 mr-4" />
                  <span className="text-lg">Mon-Sat: 10AM-7PM</span>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-10 rounded-2xl border border-white/20">
              {/* DANISMANLIK FORMU */}
              <h3 className="text-3xl font-serif mb-8">Danışmanlık Randevusu Alın</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Adınız</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                      placeholder="Adınız"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Soyadınız</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                      placeholder="Soyadınız"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">E-posta</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                    placeholder="eposta@adresiniz.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Düğün Tarihi</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hayalinizdeki tasarımı anlatın</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                    placeholder="Hayalinizdeki kırtasiyeyi anlatın..."
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-rose-600 hover:bg-rose-700 transition-colors font-medium"
                >
                  Randevu Al
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2024 Bella Color. Tüm hakları saklıdır. | Lüks Düğün Kırtasiyesi
          </p>
        </div>
      </footer>
    </div>
  )
}
