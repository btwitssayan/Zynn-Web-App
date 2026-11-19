import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import { LoginSheet } from './components/LoginSheet'
import { PageTransition } from './components/PageTransition'
import { ToastHost } from './components/Overlays'
import { LiquidGlassFilters } from './components/ui/liquid-glass'
import { isReelId } from './data/reels'
import Account from './screens/Account'
import { AddAddress, AddressBook, ChooseAddress } from './screens/Addresses'
import Cart from './screens/Cart'
import Chat from './screens/Chat'
import { ReviewOrder } from './screens/Checkout'
import DevGallery from './screens/DevGallery'
import Favourites from './screens/Favourites'
import Home from './screens/Home'
import { LoginOtp, LoginPhone } from './screens/Login'
import NotFound from './screens/NotFound'
import { OrderDetail, Orders, Placed, Track } from './screens/Orders'
import { PayQr, PayResult, PayUpi } from './screens/Payment'
import { ConnectedStores, ConnectStores } from './screens/Stores'
import { AppProvider } from './store/AppStore'

function HomeRoute() {
  const { reelId } = useParams()
  const id = isReelId(reelId) ? reelId : 'beauty'
  return <Home key={id} reelId={id} />
}

function PayResultRoute() {
  const { status } = useParams()
  if (status !== 'success' && status !== 'failed' && status !== 'duplicate') return <Navigate to="/" replace />
  return <PayResult key={status} status={status} />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function AppRoutes() {
  const location = useLocation()
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/reel/:reelId" element={<HomeRoute />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/connect" element={<ConnectStores />} />
        <Route path="/address" element={<ChooseAddress />} />
        <Route path="/address/new" element={<AddAddress />} />
        <Route path="/addresses" element={<AddressBook />} />
        <Route path="/checkout/:i" element={<ReviewOrder />} />
        <Route path="/pay/upi/:i" element={<PayUpi />} />
        <Route path="/pay/qr/:i" element={<PayQr />} />
        <Route path="/pay/:status/:i" element={<PayResultRoute />} />
        <Route path="/placed/:i" element={<Placed />} />
        <Route path="/track/:id" element={<Track />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/account" element={<Account />} />
        <Route path="/account/stores" element={<ConnectedStores />} />
        <Route path="/login" element={<LoginPhone />} />
        <Route path="/login/otp" element={<LoginOtp />} />
        <Route path="/dev" element={<DevGallery />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ScrollToTop />
        <div className="app-frame">
          <AppRoutes />
        </div>
        <ToastHost />
        <LiquidGlassFilters />
        <LoginSheet />
      </AppProvider>
    </BrowserRouter>
  )
}
