export interface CartItem {
  id: string
  title: string
  type: "digital" | "printed"
  quantity: number
  price: number
  dimensions?: string
  paperType?: string
  finishing?: string
  urgentDelivery?: boolean
  templateId?: string
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
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    district: string
    postalCode: string
    country: string
  }
  billingAddress: {
    address: string
    city: string
    district: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentDetails: {
    cardNumber: string
    expiryDate: string
    cvv: string
    cardHolder: string
  }
  specialInstructions: string
  sameAsBilling: boolean
  orderId?: string
  orderTotal?: number
  orderDate?: string
}
