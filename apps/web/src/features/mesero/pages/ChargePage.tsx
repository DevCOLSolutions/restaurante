import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, User, ChefHat, ShoppingCart, Banknote, CreditCard, Printer, Mail, FileText, Check, Percent, Plus, Minus } from "lucide-react"
import { formatCurrency } from "@/core/utils"
import { ordersByTable, waiterByTable } from "../tables/mocks/data"

const tipOptions = [0, 10, 15, 20]

export function ChargePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const tableNumber = (location.state as { table?: number; people?: number })?.table ?? 0
  const peopleCount = (location.state as { table?: number; people?: number })?.people ?? 0

  const [tipPercent, setTipPercent] = useState<number | null>(null)
  const [customTip, setCustomTip] = useState<number>(0)
  const [paid, setPaid] = useState(false)
  const [invoiced, setInvoiced] = useState(false)

  const items = ordersByTable[tableNumber] ?? []
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const tax = Math.round(subtotal * 0.2)
  const tipAmount = tipPercent !== null ? Math.round(subtotal * (tipPercent / 100)) : customTip
  const total = subtotal + tax + tipAmount
  const waiter = waiterByTable[tableNumber] ?? "—"

  const handlePay = () => setPaid(true)

  if (paid) {
    return (
      <div className="w-full pb-4">
        <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400">
              <Check size={20} />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white tracking-tight">Pago completado</h1>
              <p className="text-xs text-white/50">Mesa {String(tableNumber).padStart(2, "0")}</p>
            </div>
          </div>
        </div>
        <div className="px-4 mt-12 text-center space-y-4" style={{ animation: "fadeSlideUp 0.5s ease-out" }}>
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500" style={{ animation: "bounceIn 0.6s ease-out 0.2s both" }}>
              <Check size={32} />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">¡Pago exitoso!</h2>
          <p className="text-neutral-500">El cobro de la mesa {String(tableNumber).padStart(2, "0")} se ha completado.</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm text-emerald-600 font-medium">
            <FileText size={14} />
            {invoiced ? "Factura generada" : "Sin factura"}
          </div>
          <div className="flex flex-col gap-2 pt-2 max-w-xs mx-auto">
            <button className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Printer size={16} />
              Imprimir ticket
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
              <Mail size={16} />
              Enviar por correo
            </button>
            <button
              onClick={() => navigate("/app/mesero/tables")}
              className="flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Volver a mesas
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3); } 50% { transform: scale(1.1); } 70% { transform: scale(0.9); } 100% { opacity: 1; transform: scale(1); } }
        `}</style>
      </div>
    )
  }

  return (
    <div className="w-full pb-4">
      {/* Hero */}
      <div className="relative w-full bg-neutral-900 px-5 pt-5 pb-5 rounded-b-4xl overflow-hidden">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate(-1)} className="text-white/70 hover:text-white">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white">
              <Banknote size={20} />
            </div>
            <div>
              <p className="text-xs text-white/50">Cobrar</p>
              <h1 className="text-xl font-medium text-white tracking-tight leading-tight">
                Mesa {String(tableNumber).padStart(2, "0")}
              </h1>
            </div>
          </div>
          <span className="ml-auto text-xs text-white/40">{peopleCount} {peopleCount === 1 ? "persona" : "personas"}</span>
        </div>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* Order summary */}
        <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide flex items-center gap-1.5">
              <ShoppingCart size={13} /> Orden
            </p>
            <span className="text-xs text-neutral-400 flex items-center gap-1">
              <User size={12} /> {waiter}
            </span>
          </div>
          <div className="px-4 py-3 space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-neutral-700">{item.quantity}x {item.name}</span>
                <span className="text-neutral-500 text-xs">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-neutral-100 space-y-1 text-sm">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>IVA (20%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Propina ({tipPercent !== null ? `${tipPercent}%` : "—"})</span>
                <span>{formatCurrency(tipAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-neutral-900 pt-1 border-t border-neutral-200">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="rounded-xl border border-neutral-200 bg-white px-4 py-3">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide mb-3">Propina</p>
          <div className="flex gap-2 mb-3">
            {tipOptions.map((p) => (
              <button
                key={p}
                onClick={() => { setTipPercent(p); setCustomTip(0) }}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
                  tipPercent === p
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {p === 0 ? "Sin" : `${p}%`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Otro:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setCustomTip(Math.max(0, customTip - 10)); setTipPercent(null) }}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <Minus size={12} />
              </button>
              <span className="text-sm font-bold text-neutral-900 w-12 text-center tabular-nums">
                {formatCurrency(customTip)}
              </span>
              <button
                onClick={() => { setCustomTip(customTip + 10); setTipPercent(null) }}
                className="flex items-center justify-center w-7 h-7 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 transition-colors"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice toggle */}
        <label className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText size={16} className="text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-900">Generar factura</p>
              <p className="text-xs text-neutral-400">RFC: {invoiced ? "XAXX010101000" : "—"}</p>
            </div>
          </div>
          <div
            onClick={() => setInvoiced(!invoiced)}
            className={`w-10 h-6 rounded-full transition-colors relative ${invoiced ? "bg-neutral-900" : "bg-neutral-200"}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${invoiced ? "translate-x-[18px]" : "translate-x-0.5"}`} />
          </div>
        </label>

        {/* Pay button */}
        <button
          onClick={handlePay}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 py-3.5 text-sm font-medium text-white hover:bg-neutral-800 transition-colors shadow-sm"
        >
          <CreditCard size={16} />
          Cobrar {formatCurrency(total)}
        </button>

        <p className="text-center text-[10px] text-neutral-400 pb-2">
          Al cobrar se marcará la orden como pagada y se liberará la mesa
        </p>
      </div>
    </div>
  )
}
