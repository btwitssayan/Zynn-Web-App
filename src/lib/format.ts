export const inr = (n: number) => '₹' + n.toLocaleString('en-IN')

export const inr2 = (n: number) =>
  '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const maskPhone = (phone: string) => {
  const d = phone.replace(/\D/g, '')
  return `+91 ${d.slice(0, 2)}•••••${d.slice(-3)}`
}

export const formatPhone = (digits: string) => (digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits)

export const formatWhen = (ts: number) => {
  const d = new Date(ts)
  const month = d.toLocaleString('en-IN', { month: 'short' })
  const time = d.toLocaleString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase()
  return `${d.getDate()} ${month}, ${time}`
}
