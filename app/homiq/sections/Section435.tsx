const insights = [
  { key: "setup", title: "Setup", text: "Five screens guide light setup. Add a clear path for failed pairing.", left: 21, top: 121 },
  { key: "context", title: "Context", text: "Three room cards pair a distinct name with a photograph.", left: 354, top: 121 },
  { key: "control", title: "Control", text: "Three control types share room, power and value feedback.", left: 687, top: 121 },
  { key: "scenes", title: "Scenes", text: "Six membership options precede four desired-state switches.", left: 188, top: 414 },
  { key: "validation", title: "Validation", text: "Connect each observed pattern to a real task and a measurable check.", left: 521, top: 414 },
];
export default function Section435() {
  return <div className="relative size-full" data-node-id="3:435">
    <h2 className="[word-break:break-word] absolute font-['Inter_Display:Medium'] leading-[30px] left-0 not-italic text-[25px] text-white top-0 whitespace-nowrap">Key Insights & Opportunities</h2>
    <p className="[word-break:break-word] absolute font-['Inter_Display:Regular'] leading-[21.6px] left-0 not-italic text-[#7a7a7a] text-[18px] top-[40px] whitespace-nowrap">The audit led me to prioritize familiar rooms, quick access to controls and clearer device states.</p>
    {insights.map((item, index) => <div key={item.key} data-insight={item.key} className="homiq-insight-circle" style={{ left: item.left, top: item.top }}><span className="homiq-insight-number">{index + 1}</span><p className="homiq-insight-text">{item.title}. {item.text}</p></div>)}
  </div>;
}
