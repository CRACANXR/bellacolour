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

  const services = [
    {
      title: "Wedding Invitations",
      description: "Exquisite, bespoke wedding invitations crafted to perfection",
      icon: Heart,
      features: ["Custom Calligraphy", "Premium Paper Stock", "Gold Foil Options"],
      price: "Starting at $4.99 each",
      color: "rose",
    },
    {
      title: "Save the Dates",
      description: "Elegant announcements to mark your special day",
      icon: Crown,
      features: ["Matching Designs", "Digital Options", "Express Delivery"],
      price: "Starting at $2.99 each",
      color: "purple",
    },
    {
      title: "Event Stationery",
      description: "Complete stationery suites for memorable occasions",
      icon: Sparkles,
      features: ["Menu Cards", "Place Cards", "Thank You Notes"],
      price: "Starting at $1.99 each",
      color: "amber",
    },
    {
      title: "Custom Design",
      description: "Bespoke designs tailored to your unique vision",
      icon: Palette,
      features: ["Personal Consultation", "Unlimited Revisions", "Luxury Finishes"],
      price: "Starting at $299",
      color: "emerald",
    },
  ]

  const features = [
    {
      icon: Edit3,
      title: "Elegant Design Studio",
      description: "Professional design tools with luxury templates and typography",
    },
    {
      icon: Crown,
      title: "Premium Materials",
      description: "Finest paper stocks, foils, and finishing options available",
    },
    {
      icon: Gift,
      title: "White Glove Service",
      description: "Personal design consultation and dedicated customer care",
    },
    {
      icon: Award,
      title: "Award-Winning Quality",
      description: "Recognized excellence in wedding stationery design",
    },
  ]

  const testimonials = [
    {
      name: "Isabella & James",
      text: "Absolutely stunning invitations! The attention to detail and quality exceeded our expectations. Our guests are still talking about them.",
      rating: 5,
      location: "Beverly Hills, CA",
    },
    {
      name: "Sophia & Alexander",
      text: "The design process was seamless and the final product was pure perfection. Bella Color truly understands luxury stationery.",
      rating: 5,
      location: "Manhattan, NY",
    },
    {
      name: "Charlotte & William",
      text: "From concept to delivery, everything was flawless. The gold foil details were absolutely breathtaking.",
      rating: 5,
      location: "London, UK",
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
                  <span className="text-xs text-gray-500 tracking-widest uppercase">Luxury Stationery</span>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#services" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  Collections
                </a>
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                      Design Studio
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-64 bg-white/95 backdrop-blur-sm">
                    <DropdownMenuItem onClick={onNavigateToEditor} className="cursor-pointer p-4">
                      <Heart className="mr-3 h-5 w-5 text-rose-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Wedding Invitations</div>
                        <div className="text-sm text-gray-500">Create your perfect invitation</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer p-4">
                      <Crown className="mr-3 h-5 w-5 text-purple-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Save the Dates</div>
                        <div className="text-sm text-gray-500">Elegant announcements</div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer p-4">
                      <Sparkles className="mr-3 h-5 w-5 text-amber-500" />
                      <div>
                        <div className="font-semibold text-gray-900">Event Stationery</div>
                        <div className="text-sm text-gray-500">Complete suites</div>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <a href="#about" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  About
                </a>
                <a href="#contact" className="text-gray-700 hover:text-rose-600 transition-colors font-medium">
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="font-medium">
                Portfolio
              </Button>
              <Button onClick={onNavigateToEditor} className="bg-rose-600 hover:bg-rose-700 font-medium">
                Start Designing
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
                Exquisite
                <span className="block text-rose-600 italic">Wedding</span>
                <span className="block">Stationery</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
                Create breathtaking wedding invitations with our luxury design studio. Every detail crafted to
                perfection for your most important day.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  size="lg"
                  onClick={onNavigateToEditor}
                  className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-4 font-medium"
                >
                  Begin Your Design
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 font-medium border-2 bg-transparent">
                  View Portfolio
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start mt-12 space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Happy Couples</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Design Awards</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">15</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wide">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <img
                  src="/placeholder.svg?height=500&width=350"
                  alt="Luxury wedding invitation sample"
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute -top-6 -right-6 bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  New Collection
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg border">
                  Premium Foil
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
            <h2 className="text-5xl font-serif text-gray-900 mb-6">The Bella Color Difference</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We combine traditional craftsmanship with modern design technology to create stationery that tells your
              unique love story
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
            <h2 className="text-5xl font-serif text-gray-900 mb-6">Our Collections</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our curated selection of luxury stationery designed for life's most precious moments
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
                    Explore Collection
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
            <h2 className="text-5xl font-serif text-gray-900 mb-6">Love Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from couples who trusted us with their most important announcements
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
              <h2 className="text-5xl font-serif mb-8">Let's Create Something Beautiful</h2>
              <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                Ready to begin your stationery journey? Our design consultants are here to bring your vision to life.
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
              <h3 className="text-3xl font-serif mb-8">Schedule Consultation</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                      placeholder="Your last name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Wedding Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Tell us about your vision</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:outline-none focus:border-rose-400 text-white placeholder-gray-300"
                    placeholder="Describe your dream stationery..."
                  ></textarea>
                </div>
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-lg py-4 font-medium">
                  Schedule Consultation
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <img src="/images/bella-color-white-logo.png" alt="Bella Color" className="h-12 w-auto mb-6" />
              <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
                Luxury wedding stationery crafted with passion and precision. Creating beautiful beginnings for your
                love story since 2009.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">@</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Collections</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Wedding Invitations
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Save the Dates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Event Stationery
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Custom Design
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Portfolio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Process
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Bella Color. All rights reserved. | Luxury Wedding Stationery</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
