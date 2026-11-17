import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { bestOffer, offerFor, PRODUCTS } from '../data/products'
import { DEMO_NAME, SEED_ADDRESSES, SEED_FAVOURITES, SEED_ORDERS } from '../data/seed'
import { STORES, type Address, type Order, type StoreName } from '../data/types'
import { billFor } from '../lib/bill'

export interface CartLine {
  productId: string
  store: StoreName
  qty: number
}

export interface User {
  name: string
  phone: string
}

const maxFor = (productId: string, store: StoreName) => offerFor(PRODUCTS[productId], store)?.max ?? 9

export const unitPrice = (l: CartLine) => offerFor(PRODUCTS[l.productId], l.store)?.price ?? 0

function useAppState() {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartLine[]>([])
  const [favourites, setFavourites] = useState<string[]>(SEED_FAVOURITES)
  const [connected, setConnectedMap] = useState<Record<StoreName, boolean>>({ Instamart: true, Zepto: false })
  const [addresses, setAddresses] = useState(SEED_ADDRESSES)
  const [selected, setSelected] = useState<Record<StoreName, string>>({ Instamart: 'home', Zepto: 'home' })
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS)
  const [checkout, setCheckout] = useState<StoreName[]>([])
  const [sessionOrders, setSessionOrders] = useState<string[]>([])
  const [coupon, setCoupon] = useState<string | null>(null)
  const [loginPrompt, setLoginPrompt] = useState(false)
  const [toastMsg, setToastMsg] = useState<{ id: number; text: string } | null>(null)
  const pending = useRef<{ productId: string; store: StoreName }[]>([])

  const toast = useCallback((text: string) => setToastMsg({ id: Date.now(), text }), [])
  const clearToast = useCallback(() => setToastMsg(null), [])

  const setQty = useCallback((productId: string, store: StoreName, qty: number) => {
    setCart((c) => {
      const q = Math.min(qty, maxFor(productId, store))
      const i = c.findIndex((l) => l.productId === productId && l.store === store)
      if (q <= 0) return i < 0 ? c : c.filter((_, k) => k !== i)
      if (i < 0) return [...c, { productId, store, qty: q }]
      return c.map((l, k) => (k === i ? { ...l, qty: q } : l))
    })
  }, [])

  const rawAdd = useCallback((productId: string, store: StoreName) => {
    setCart((c) => {
      const l = c.find((x) => x.productId === productId && x.store === store)
      if (!l) return [...c, { productId, store, qty: 1 }]
      return c.map((x) => (x === l ? { ...x, qty: Math.min(x.qty + 1, maxFor(productId, store)) } : x))
    })
  }, [])

  const qtyOf = (productId: string) => cart.filter((l) => l.productId === productId).reduce((s, l) => s + l.qty, 0)
  const lineQty = (productId: string, store: StoreName) =>
    cart.find((l) => l.productId === productId && l.store === store)?.qty ?? 0

  const openLogin = () => setLoginPrompt(true)
  const closeLogin = (keepPending = false) => {
    if (!keepPending) pending.current = []
    setLoginPrompt(false)
  }

  const add = (productId: string, store?: StoreName) => {
    const s = store ?? bestOffer(PRODUCTS[productId])?.store
    if (!s) return false
    if (!user) {
      pending.current = [{ productId, store: s }]
      setLoginPrompt(true)
      return false
    }
    rawAdd(productId, s)
    toast(`Added from ${s}`)
    return true
  }

  const addMany = (ids: string[]) => {
    const todo = ids
      .filter((id) => qtyOf(id) === 0)
      .map((id) => ({ productId: id, store: bestOffer(PRODUCTS[id])?.store }))
      .filter((x): x is { productId: string; store: StoreName } => !!x.store)
    if (!todo.length) return
    if (!user) {
      pending.current = todo
      setLoginPrompt(true)
      return
    }
    todo.forEach((x) => rawAdd(x.productId, x.store))
    toast(`Added ${todo.length} ${todo.length === 1 ? 'item' : 'items'}`)
  }

  const bumpProduct = (productId: string, delta: number) => {
    const l = cart.find((x) => x.productId === productId)
    if (l) setQty(productId, l.store, l.qty + delta)
  }

  const login = (phone: string) => {
    setUser({ name: DEMO_NAME, phone })
    pending.current.forEach((x) => rawAdd(x.productId, x.store))
    pending.current = []
  }

  const logout = () => {
    setUser(null)
    setCart([])
    setCheckout([])
  }

  const deleteAccount = () => {
    logout()
    setFavourites([])
    setOrders([])
  }

  const toggleFav = (id: string) => {
    const has = favourites.includes(id)
    setFavourites((f) => (has ? f.filter((x) => x !== id) : [...f, id]))
    toast(has ? 'Removed from favourites' : 'Saved to favourites')
  }

  const setConnected = (s: StoreName, v: boolean) => setConnectedMap((m) => ({ ...m, [s]: v }))

  const addAddress = (stores: StoreName[], a: Omit<Address, 'id'>) => {
    const addr: Address = { ...a, id: `a${Date.now()}` }
    setAddresses((m) => {
      const next = { ...m }
      stores.forEach((s) => (next[s] = [...m[s], addr]))
      return next
    })
    setSelected((m) => {
      const next = { ...m }
      stores.forEach((s) => (next[s] = addr.id))
      return next
    })
  }

  const deleteAddress = (s: StoreName, id: string) => {
    setAddresses((m) => ({ ...m, [s]: m[s].filter((a) => a.id !== id) }))
    if (selected[s] === id) setSelected((m) => ({ ...m, [s]: addresses[s].find((a) => a.id !== id)?.id ?? '' }))
  }

  const addressFor = (s: StoreName) => addresses[s].find((a) => a.id === selected[s]) ?? addresses[s][0]

  const startCheckout = () => {
    const stores = STORES.filter((s) => cart.some((l) => l.store === s))
    setCheckout(stores)
    setSessionOrders([])
    return stores
  }

  const itemsFor = (store: StoreName) =>
    cart
      .filter((l) => l.store === store)
      .map((l) => {
        const p = PRODUCTS[l.productId]
        return { title: p.title, size: p.size, price: unitPrice(l), qty: l.qty }
      })

  const isDuplicate = (store: StoreName) => {
    const sig = (items: { title: string; qty: number }[]) =>
      items
        .map((i) => `${i.title}x${i.qty}`)
        .sort()
        .join('|')
    const mine = sig(itemsFor(store))
    return orders.some((o) => o.store === store && Date.now() - o.createdAt < 10 * 60_000 && sig(o.items) === mine)
  }

  const placeOrder = (store: StoreName, payment: string) => {
    const items = itemsFor(store)
    const c = store === 'Instamart' ? coupon : null
    const bill = billFor(store, items, c)
    const cod = payment === 'Cash on delivery'
    const order: Order = {
      id: `${store === 'Instamart' ? 'IM' : 'ZP'}-${Math.floor(10000 + Math.random() * 89999)}`,
      store,
      createdAt: Date.now(),
      items,
      bill: bill.rows,
      total: bill.total,
      status: 'placed',
      pills: cod
        ? [
            { k: 'placed', t: 'Placed' },
            { k: 'pend', t: 'Payment pending (Cash on delivery)' },
          ]
        : [{ k: 'placed', t: 'Placed' }],
      payment,
      address: addressFor(store),
      eta: store === 'Instamart' ? 8 : 12,
    }
    setOrders((o) => [order, ...o])
    setCart((cl) => cl.filter((l) => l.store !== store))
    setSessionOrders((s) => {
      const n = [...s]
      n[Math.max(0, checkout.indexOf(store))] = order.id
      return n
    })
    if (c) setCoupon(null)
    return order
  }

  const cartCount = cart.reduce((s, l) => s + l.qty, 0)
  const cartTotal = cart.reduce((s, l) => s + l.qty * unitPrice(l), 0)

  return {
    user,
    login,
    logout,
    deleteAccount,
    cart,
    cartCount,
    cartTotal,
    qtyOf,
    lineQty,
    add,
    addMany,
    setQty,
    bumpProduct,
    favourites,
    toggleFav,
    connected,
    setConnected,
    addresses,
    selected,
    selectAddress: (s: StoreName, id: string) => setSelected((m) => ({ ...m, [s]: id })),
    addressFor,
    addAddress,
    deleteAddress,
    orders,
    placeOrder,
    isDuplicate,
    itemsFor,
    checkout,
    startCheckout,
    sessionOrders,
    coupon,
    setCoupon,
    loginPrompt,
    openLogin,
    closeLogin,
    toast,
    toastMsg,
    clearToast,
  }
}

type AppCtx = ReturnType<typeof useAppState>

const Ctx = createContext<AppCtx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  return <Ctx.Provider value={useAppState()}>{children}</Ctx.Provider>
}

export function useApp() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useApp must be used inside AppProvider')
  return v
}
