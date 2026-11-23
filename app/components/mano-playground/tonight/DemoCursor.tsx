import { motion, type MotionValue } from "motion/react"

export default function DemoCursor({ x, y, visible, down, pulse }: { x: MotionValue<number>; y: MotionValue<number>; visible: boolean; down: boolean; pulse: number }) {
  return <motion.div className="tn-demo-cursor" style={{ x, y }} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: .45 }} aria-hidden="true">
    {pulse > 0 && <motion.span key={pulse} className="tn-cursor-pulse" initial={{ scale: .3, opacity: .55 }} animate={{ scale: 1.65, opacity: 0 }} transition={{ duration: .85, ease: "easeOut" }} />}
    <motion.svg width="27" height="32" viewBox="0 0 30 34" animate={{ scale: down ? .9 : 1 }} transition={{ duration: .2 }}><path d="M4 2v24l6-7 5 11 5-2-5-11h10L4 2Z" fill="#f8faff" stroke="#10192a" strokeWidth="1.6" strokeLinejoin="round" /></motion.svg>
  </motion.div>
}
