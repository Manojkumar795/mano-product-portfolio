type DimensionProps = { x1: number; y1: number; x2: number; y2: number; label: string; vertical?: boolean };
function Dimension({x1,y1,x2,y2,label,vertical=false}: DimensionProps) {
  const tick=6; const labelWidth=label.length*10+10;
  const labelX=vertical?x1+12:(x1+x2)/2; const labelY=vertical?(y1+y2)/2:y1-10;
  return <g className="homiq-layout-dimension" data-dimension={label}>
    <path d={vertical?`M${x1-tick} ${y1}H${x1+tick}M${x1} ${y1}V${y2}M${x2-tick} ${y2}H${x2+tick}`:`M${x1} ${y1-tick}V${y1+tick}M${x1} ${y1}H${x2}M${x2} ${y2-tick}V${y2+tick}`} />
    <rect x={vertical?labelX-4:labelX-labelWidth/2} y={vertical?labelY-11:labelY-18} width={labelWidth} height="23" rx="3" fill="white" opacity=".94" />
    <text x={vertical?x1+12:(x1+x2)/2} y={vertical?(y1+y2)/2:y1-10} textAnchor={vertical?"start":"middle"} dominantBaseline={vertical?"central":"auto"}>{label}</text>
  </g>;
}
/** Measurements follow the pixel coordinates of the unchanged 390 × 844 source. */
export default function LayoutMeasurements() {
  return <svg className="homiq-layout-measurements" viewBox="0 0 650 1040" role="img" aria-label="Home layout measurements in pixels: screen 390 by 844, content 342 wide with 24 pixel insets, category cards 108 wide and 96 high with an 8 pixel gap, scene cards 164 wide and 80 high with a 12 pixel gap, device-row pitch 45, and navigation 264 by 63 with a 16 pixel gap above it.">
    <image href="/homiq/screens/my-home.png" x="100" y="120" width="390" height="844" />
    <g className="homiq-layout-overlay"><rect x="100" y="120" width="24" height="844"/><rect x="466" y="120" width="24" height="844"/><rect x="232" y="368" width="8" height="96"/><rect x="288" y="478" width="12" height="80"/><rect x="124" y="831" width="342" height="16"/></g>
    <g className="homiq-layout-outline"><rect x="124" y="368" width="108" height="96" rx="20"/><rect x="124" y="478" width="164" height="80" rx="20"/><rect x="163" y="847" width="264" height="63" rx="31"/><path d="M124 652H466M124 697H466"/></g>
    <Dimension x1={100} y1={35} x2={490} y2={35} label="390"/>
    <Dimension x1={124} y1={75} x2={466} y2={75} label="342"/>
    <Dimension x1={100} y1={105} x2={124} y2={105} label="24"/>
    <Dimension x1={466} y1={105} x2={490} y2={105} label="24"/>
    <Dimension x1={124} y1={359} x2={232} y2={359} label="108"/>
    <Dimension x1={232} y1={359} x2={240} y2={359} label="8"/>
    <Dimension x1={124} y1={570} x2={288} y2={570} label="164"/>
    <Dimension x1={288} y1={570} x2={300} y2={570} label="12"/>
    <Dimension x1={163} y1={1005} x2={427} y2={1005} label="264"/>
    <Dimension x1={520} y1={368} x2={520} y2={464} label="96" vertical/>
    <Dimension x1={520} y1={478} x2={520} y2={558} label="80" vertical/>
    <Dimension x1={520} y1={652} x2={520} y2={697} label="45" vertical/>
    <Dimension x1={520} y1={831} x2={520} y2={847} label="16" vertical/>
    <Dimension x1={520} y1={847} x2={520} y2={910} label="63" vertical/>
    <Dimension x1={585} y1={120} x2={585} y2={964} label="844" vertical/>
  </svg>;
}
