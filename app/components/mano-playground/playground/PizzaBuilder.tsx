import { useRef, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  assets,
  DemoControl,
  type DemoProps,
  Icon,
  Loading,
  money,
  spring,
  Stage,
  useDemo,
  useTimers,
} from "./shared"
import "./PizzaBuilder.css"

const toppings = [
  {
    id: "cheese",
    name: "Extra mozzarella",
    detail: "Creamy, milky, extra melty.",
    price: 200,
    image: "/playground/pizza-cheese.png",
    pieces: [
      [27, 34, -20, 0.85],
      [50, 24, 13, 0.9],
      [70, 39, 38, 0.8],
      [33, 58, 65, 0.9],
      [61, 62, -33, 1.1],
      [46, 77, 15, 0.8],
    ],
  },
  {
    id: "mushrooms",
    name: "Roasted mushrooms",
    detail: "Earthy cremini. Thinly sliced.",
    price: 150,
    image: "/playground/pizza-mushroom.png",
    pieces: [
      [40, 24, 32, 1],
      [61, 30, -18, 1],
      [23, 46, 40, 0.95],
      [49, 44, -25, 0.85],
      [74, 55, 12, 1],
      [38, 72, 64, 0.9],
      [65, 74, -42, 0.85],
    ],
  },
  {
    id: "olives",
    name: "Kalamata olives",
    detail: "Rich, briny, a little bold.",
    price: 100,
    image: "/playground/pizza-olive.png",
    pieces: [
      [32, 26, 0, 1],
      [73, 31, 27, 0.9],
      [59, 47, -5, 1.1],
      [29, 66, 22, 0.95],
      [51, 66, 39, 1],
      [75, 69, -12, 0.85],
      [51, 83, 24, 0.8],
      [22, 56, -20, 0.9],
    ],
  },
]

interface IngredientThumbProps {
  id: string
  image: string
}

interface IngredientFlight {
  id: string
  image: string
  fromX: number
  fromY: number
  toX: number
  toY: number
}

function IngredientThumb({ id, image }: IngredientThumbProps) {
  return (
    <span className={`pb-ingredient-thumb pb-thumb-${id}`} aria-hidden="true">
      <img src={image} alt="" draggable={false} />
      <img src={image} alt="" draggable={false} />
      {id === "olives" && <img src={image} alt="" draggable={false} />}
    </span>
  )
}

export default function PizzaBuilder({ isPlaying = true }: DemoProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [state, setState] = useState<"idle" | "loading" | "confirmed">("idle")
  const [flight, setFlight] = useState<IngredientFlight | null>(null)
  const root = useRef<HTMLElement>(null)
  const plate = useRef<HTMLDivElement>(null)
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({})
  const timers = useTimers()
  const total =
    1400 +
    toppings
      .filter((t) => selected.includes(t.id))
      .reduce((sum, t) => sum + t.price, 0)
  function reset() {
    timers.clear()
    setSelected([])
    setState("idle")
    setFlight(null)
  }
  function startFlight(id: string) {
    if (demo.reduced || !root.current || !plate.current) return
    const thumb = buttons.current[id]?.querySelector(".pb-ingredient-thumb")
    const topping = toppings.find((t) => t.id === id)
    if (!thumb || !topping) return
    const r = root.current.getBoundingClientRect()
    const a = thumb.getBoundingClientRect()
    const b = plate.current.getBoundingClientRect()
    // Preview-only scaling must not distort the component's animation coordinates.
    const scale = r.width / root.current.offsetWidth || 1
    setFlight({
      id,
      image: topping.image,
      fromX: (a.left - r.left) / scale,
      fromY: (a.top - r.top) / scale,
      toX: (b.left + b.width * 0.55 - r.left) / scale - 28,
      toY: (b.top + b.height * 0.42 - r.top) / scale - 28,
    })
    timers.after(1100, () => setFlight(null))
  }
  function addIngredient(id: string) {
    setSelected((values) => (values.includes(id) ? values : [...values, id]))
    startFlight(id)
  }
  const demo = useDemo(
    isPlaying,
    [
      { at: 1500, run: () => addIngredient("cheese") },
      { at: 2900, run: () => addIngredient("mushrooms") },
      { at: 4100, run: () => addIngredient("olives") },
      { at: 5500, run: () => setState("loading") },
      { at: 6400, run: () => setState("confirmed") },
    ],
    reset,
  )

  function toggle(id: string) {
    demo.takeControl()
    timers.clear()
    setFlight(null)
    setState("idle")
    if (selected.includes(id))
      setSelected((values) => values.filter((value) => value !== id))
    else addIngredient(id)
  }
  function order() {
    if (state !== "idle") return
    demo.takeControl()
    setState("loading")
    timers.after(800, () => setState("confirmed"))
  }

  return (
    <Stage
      ref={root}
      className="pg-stage pg-pizza"
      aria-label="Pizza customization interaction"
    >
      <div className="pb-layout">
        <div className="pb-visual">
          <div className="pb-pizza-scene">
            <div className="pb-pizza-shadow" />
            <div className="pb-plate" ref={plate}>
              <img
                className="pb-base-pizza"
                src={assets.pizza}
                alt="Top-down golden cheese pizza with no extra toppings"
                draggable={false}
              />
              <AnimatePresence>
                {toppings
                  .filter((t) => selected.includes(t.id))
                  .flatMap((t) =>
                    t.pieces.map(([x, y, angle, size], index) => (
                      <motion.img
                        key={`${t.id}-${index}`}
                        src={t.image}
                        alt=""
                        draggable={false}
                        className={`pb-topping pb-topping-${t.id}`}
                        style={{ left: `${x}%`, top: `${y}%` }}
                        initial={{
                          opacity: 0,
                          scale: 0.65,
                          y: -24,
                          rotate: angle - 8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: size,
                          y: 0,
                          rotate: angle,
                        }}
                        exit={{ opacity: 0, scale: 0.6, y: -10 }}
                        transition={{
                          ...spring,
                          delay: demo.reduced ? 0 : 0.4 + index * 0.065,
                        }}
                      />
                    )),
                  )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="pb-details">
          <h2>Classic cheese</h2>
          <p className="pb-size">12-inch · Stone baked</p>

          <div className="pb-options-heading">
            <h3>Add your favorites</h3>
          </div>
          <div className="pb-options">
            {toppings.map((t) => {
              const chosen = selected.includes(t.id)
              return (
                <motion.button
                  key={t.id}
                  ref={(element) => {
                    buttons.current[t.id] = element
                  }}
                  className={chosen ? "selected" : ""}
                  aria-pressed={chosen}
                  aria-label={`${
                    chosen ? "Remove" : "Add"
                  } ${t.name}, ${money(t.price)}`}
                  title={chosen ? `Remove ${t.name}` : `Add ${t.name}`}
                  onClick={() => toggle(t.id)}
                  whileTap={{ scale: 0.985 }}
                  transition={spring}
                >
                  <IngredientThumb id={t.id} image={t.image} />
                  <span className="pb-option-copy">
                    <strong>{t.name}</strong>
                  </span>
                  <span className="pb-option-price">+{money(t.price)}</span>
                  <span className="pb-option-toggle">
                    <Icon name={chosen ? "check" : "plus"} size={16} />
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="pizza-total pb-total">
            <span>Total</span>
            <motion.strong
              key={total}
              initial={{ opacity: 0.6, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              {money(total)}
            </motion.strong>
          </div>
          <motion.button
            className={`pg-primary pb-order ${
              state === "confirmed" ? "confirmed" : ""
            }`}
            whileTap={{ scale: 0.985 }}
            onClick={order}
            disabled={state !== "idle"}
          >
            {state === "loading" ? (
              <>
                <Loading />
                Adding to order
              </>
            ) : state === "confirmed" ? (
              <>
                <Icon name="check" />
                Added to your order
              </>
            ) : (
              <>
                Add to order
                <Icon name="arrow" />
              </>
            )}
          </motion.button>
        </div>
      </div>
      <AnimatePresence>
        {flight && (
          <motion.img
            key={flight.id}
            src={flight.image}
            alt=""
            className="pb-flight"
            draggable={false}
            initial={{
              x: flight.fromX,
              y: flight.fromY,
              width: 48,
              opacity: 1,
            }}
            animate={{
              x: [flight.fromX, flight.toX],
              y: [
                flight.fromY,
                Math.min(flight.fromY, flight.toY) - 60,
                flight.toY,
              ],
              width: [48, 78, 56],
              opacity: [1, 1, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>
      <DemoControl demo={demo} />
      <span className="pg-sr-only" role="status">
        {state === "confirmed" ? `Pizza added. Total ${money(total)}.` : ""}
      </span>
    </Stage>
  )
}
