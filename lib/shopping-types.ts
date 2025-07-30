export type ProductType = "digital" | "printed"
export type PaperType = "standard" | "premium_matte" | "premium_glossy" | "luxury_textured" | "pearl"
export type FinishingType = "none" | "uv_coating" | "gold_foil" | "silver_foil" | "embossing"

export interface CartItem {
  id: string
  title: string
  type: ProductType
  quantity: number
  price: number // Price per unit for printed, total for digital
  dimensions?: string
  paperType?: PaperType
  finishing?: FinishingType
  urgentDelivery?: boolean
}

export interface ShippingAddress {
  firstName: string
  lastName: string
  company?: string
  address: string
  city: string
  state?: string
  zipCode: string
  country: string
  phone: string
}

export interface PaymentInfo {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: ShippingAddress
  billingAddress?: ShippingAddress
  paymentInfo: {
    cardholderName: string
    cardNumber: string
  }
  status: "processing" | "confirmed" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  estimatedDelivery?: string
}

export interface CheckoutData {
  orderId: string
  orderTotal: number
  items: CartItem[]
  shippingAddress: ShippingAddress
  billingAddress: ShippingAddress
  paymentMethod: string
  paymentDetails: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardHolder: string
  }
  specialInstructions: string
  sameAsBilling: boolean
  orderDate?: string
}
