import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { type DemoProps, Icon, Loading, money, spring, Stage, useDemo, useTimers } from "./shared"
import "./OneTapCheckout.css"
import { useAutoplayResume } from "../idle-autoplay"

const subtotal = 13800
const tax = Math.round(subtotal * 0.08)
const total = subtotal + tax
const addresses = [
  { id: "home", name: "Home · Mano", street: "24 Example Street", city: "Brooklyn, NY 11201" },
  { id: "studio", name: "Studio · Mano", street: "8 Sample Lane", city: "Brooklyn, NY 11201" },
]
const payments = [
  { id: "wallet", name: "Demo Wallet", detail: "Saved payment method" },
  { id: "card", name: "Demo Card", detail: "Ending in 4242" },
]
type Editor = "delivery" | "payment"

function DeliveryIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 7 9-5 9 5v10l-9 5-9-5V7Zm0 0 9 5 9-5M12 12v10M7.5 4.5l9 5v4" /></svg>
}

export default function OneTapCheckout({ isPlaying = true }: DemoProps) {
  const [addressId, setAddressId] = useState("home")
  const [paymentId, setPaymentId] = useState("wallet")
  const [state, setState] = useState<"ready" | "processing" | "success">("ready")
  const [editor, setEditor] = useState<Editor | null>(null)
  const [draft, setDraft] = useState("")
  const [manualEditing, setManualEditing] = useState(false)
  const paymentTimers = useTimers()
  const inlineEditor = useRef<HTMLDivElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const changeButtons = useRef<Partial<Record<Editor, HTMLButtonElement | null>>>({})
  const headingId = useId()
  const address = addresses.find((item) => item.id === addressId) ?? addresses[0]
  const payment = payments.find((item) => item.id === paymentId) ?? payments[0]

  function resetDemo() {
    paymentTimers.clear()
    setAddressId("home"); setPaymentId("wallet"); setDraft("")
    setEditor(null); setManualEditing(false); setState("ready")
  }
  const demo = useDemo(
    isPlaying && !manualEditing,
    [
      { at: 1200, run: () => { setEditor("payment"); setDraft("wallet") } },
      { at: 2400, run: () => setDraft("card") },
      { at: 3500, run: () => { setPaymentId("card"); setEditor(null) } },
      { at: 4800, run: () => setState("processing") },
      { at: 6200, run: () => setState("success") },
    ],
    resetDemo,
    11000,
  )
  const watching = demo.label === "Auto demo"
  const confirmed = state === "success"
  useAutoplayResume(() => { setManualEditing(false); setEditor(null) })

  useEffect(() => {
    if (!editor || watching) return
    const timer = setTimeout(() => inlineEditor.current?.querySelector<HTMLInputElement>("input:checked")?.focus(), 80)
    return () => clearTimeout(timer)
  }, [editor, watching])

  useEffect(() => {
    if (state === "success" && !watching) successHeading.current?.focus({ preventScroll: true })
  }, [state, watching])

  function stopDemo() { demo.takeControl() }
  function openEditor(type: Editor) {
    if (state !== "ready") return
    stopDemo()
    if (editor === type) { setEditor(null); setManualEditing(false); return }
    setManualEditing(true)
    setDraft(type === "delivery" ? addressId : paymentId)
    setEditor(type)
  }
  function finishEdit(apply: boolean) {
    stopDemo()
    if (apply && editor === "delivery") setAddressId(draft)
    if (apply && editor === "payment") setPaymentId(draft)
    const trigger = editor ? changeButtons.current[editor] : null
    setEditor(null)
    setManualEditing(false)
    trigger?.focus()
  }
  function pay() {
    if (state !== "ready" || editor) return
    stopDemo(); paymentTimers.clear(); setState("processing")
    paymentTimers.after(1200, () => setState("success"))
  }
  function renderEditor(type: Editor) {
    const choices = type === "delivery" ? addresses : payments
    return <AnimatePresence initial={false}>
      {editor === type && <motion.div className="xc-inline-editor" ref={inlineEditor} id={`${headingId}-${type}`} initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={spring} onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); finishEdit(false) } }}>
        <fieldset className="xc-editor-options">
          <legend className="pg-sr-only">{type === "delivery" ? "Choose delivery address" : "Choose payment method"}</legend>
          {choices.map((item) => <label key={item.id} className={draft === item.id ? "selected" : ""}>
            <input type="radio" name={`${headingId}-${type}`} checked={draft === item.id} value={item.id} onChange={() => { stopDemo(); setDraft(item.id) }} />
            <span><strong>{item.name}</strong><small>{"street" in item ? `${item.street} · ${item.city}` : item.detail}</small></span>
            {draft === item.id && <Icon name="check" size={15} />}
          </label>)}
        </fieldset>
        <div className="xc-editor-actions"><button onClick={() => finishEdit(false)}>Cancel</button><button className="xc-save" onClick={() => finishEdit(true)}>Save {type === "delivery" ? "address" : "payment"}<Icon name="check" size={14} /></button></div>
      </motion.div>}
    </AnimatePresence>
  }

  return <Stage className="pg-stage pg-checkout" aria-label="Interactive express checkout">
    <div className="xc-ambient" aria-hidden="true" />
    <div className="xc-card">
      <div className="xc-review" inert={confirmed}>
        <header className="xc-card-heading"><h2>Express checkout</h2><span className="xc-ready-status"><i />{watching ? "Demo" : state === "processing" ? "Paying" : "Ready"}</span></header>
        <div className="xc-product-summary"><div className="xc-thumbnail xc-reference-shoe" role="img" aria-label="White Form 01 sneaker with a black heel" /><div><strong>Form 01</strong><span>Cloud White / Onyx</span><small>EU 42 · Quantity 1</small></div><strong className="xc-product-price">{money(subtotal)}</strong></div>
        <div className="xc-details">
          <section className="xc-saved-detail" aria-label="Delivery details">
            <div className="xc-detail-row"><span className="xc-detail-icon"><DeliveryIcon /></span><div className="xc-detail-copy"><span>Deliver to</span><strong>{address.name}</strong><small>{address.street} · {address.city}</small></div><button className="xc-change" ref={(node) => { changeButtons.current.delivery = node }} onClick={() => openEditor("delivery")} disabled={state !== "ready"} aria-expanded={editor === "delivery"} aria-controls={editor === "delivery" ? `${headingId}-delivery` : undefined} aria-label="Change delivery address">{editor === "delivery" ? "Close" : "Change"}</button></div>
            {renderEditor("delivery")}
          </section>
          <section className="xc-saved-detail" aria-label="Payment details">
            <div className="xc-detail-row"><span className="xc-detail-icon"><Icon name="card" size={20} /></span><div className="xc-detail-copy"><span>Pay with</span><strong>{payment.name}</strong><small>{payment.detail}</small></div><button className="xc-change" ref={(node) => { changeButtons.current.payment = node }} onClick={() => openEditor("payment")} disabled={state !== "ready"} aria-expanded={editor === "payment"} aria-controls={editor === "payment" ? `${headingId}-payment` : undefined} aria-label="Change payment method">{editor === "payment" ? "Close" : "Change"}</button></div>
            {renderEditor("payment")}
          </section>
        </div>
        <div className="xc-price-breakdown"><div><span>Subtotal</span><span>{money(subtotal)}</span></div><div><span>Delivery</span><span className="xc-free">Free</span></div><div><span>Tax · 8%</span><span>{money(tax)}</span></div></div>
        <div className="xc-total"><span>Total</span><strong>{money(total)}</strong></div>
        <motion.button className="xc-pay" onClick={pay} whileTap={{ scale: 0.985 }} disabled={state === "processing" || !!editor} aria-busy={state === "processing"}>{state === "processing" ? <><Loading />Processing…<motion.span className="xc-pay-progress" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "easeInOut" }} /></> : <>Pay {money(total)}<Icon name="arrow" size={19} /></>}</motion.button>
        <p className="xc-demo-note">{editor ? "Save or cancel your changes to continue." : "Demo purchase · No real charge"}</p>
      </div>
      {confirmed && <div className="xc-success">
        <header className="xc-success-header">
          <motion.div className="xc-confirmation-mark" initial={{ scale: 0.85 }} animate={{ scale: 1 }} transition={spring}><Icon name="check" size={44} /></motion.div>
          <span className="xc-success-kicker">ALL SET</span>
          <h2 ref={successHeading} tabIndex={-1}>Order confirmed</h2>
          <p>Your demo order is complete.<br />No charge was made.</p>
        </header>
        <div className="xc-confirmation-summary">
          <img
            className="xc-confirmation-image"
            src="/playground/checkout-form-01.webp"
            alt="White Form 01 sneaker with a black heel"
            width={242}
            height={195}
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
          />
          <div className="xc-confirmation-product">
            <div className="xc-confirmation-copy">
              <span className="xc-product-brand">MANO</span>
              <strong>Form 01</strong>
              <small>White / Black · EU 42 · Qty 1</small>
            </div>
            <strong className="xc-confirmation-price">{money(total)}</strong>
          </div>
        </div>
        <div className="xc-confirmation-details"><div><span className="xc-confirmation-icon"><DeliveryIcon /></span><span><small>Delivery</small><strong>{address.name}</strong><span>{address.street}<br />{address.city}</span></span></div><div><span className="xc-confirmation-icon"><Icon name="card" size={20} /></span><span><small>Demo payment</small><strong>{payment.name}{paymentId === "card" ? " · 4242" : ""}</strong></span></div></div>
      </div>}
    </div>
    <span className="pg-sr-only" role="status" aria-live="polite">{state === "processing" ? "Processing demo payment." : state === "success" ? "Demo order confirmed. No real charge was made." : "Review your order and saved details before paying."}</span>
  </Stage>
}
