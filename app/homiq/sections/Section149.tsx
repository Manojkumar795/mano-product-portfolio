/* Homiq content inside the preserved editorial section geometry. */

const imgIcon = "/homiq/editorial/149-imgIcon.svg";

export default function Section149() {
  return (
    <div className="relative size-full" data-node-id="3:149" data-name="Container">
      <h2 className="[word-break:break-word] absolute font-['Inter_Display:Medium'] leading-[30px] left-0 not-italic text-[25px] text-white top-[21px] whitespace-nowrap" data-node-id="3:150">{"Our Vision"}</h2>
      
      <div className="absolute content-stretch flex flex-col h-[84px] items-start left-0 top-[111px] w-[1002px]" data-node-id="3:154" data-name="Container">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:155" data-name="Paragraph">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#7a7a7a] text-[18px] w-[1002px]" data-node-id="3:156"><span className="font-['Inter_Display:Regular'] leading-[21.6px]">{"HOMIQ brings "}</span><span className="font-['Inter_Display:Regular'] leading-[21.6px] text-white">{"home, rooms and appliance controls"}</span><span className="font-['Inter_Display:Regular'] leading-[21.6px]">{" together around the way people use a home. Each interaction needed to answer three questions: where is the device, what is it doing and what can I change? I organized the experience around "}</span><span className="font-['Inter_Display:Regular'] leading-[21.6px] text-white">{"recognizable rooms, guided setup and readable states"}</span><span className="font-['Inter_Display:Regular'] leading-[21.6px]">{", keeping daily actions close without hiding room and scene configuration."}</span></p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col h-[3px] items-start left-[-1px] top-[79px] w-[1004px]" data-node-id="3:157" data-name="Container">
        <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:158" data-name="Icon">
          <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
        </div>
      </div>
    </div>
  );
}
