import "./CreatorCredit.css"

export default function CreatorCredit({ className = "" }: { className?: string }) {
  return <div className={`creator-credit ${className}`}><span className="creator-credit__dot" aria-hidden="true" />Curated by Mano</div>
}
