/* Homiq content inside the preserved editorial section geometry. */

const imgIcon = "/homiq/editorial/884-imgIcon.svg";

export default function Section884() {
  return (
    <div className="relative size-full" data-node-id="3:884" data-name="Container">
      <h2 className="[word-break:break-word] absolute font-['Inter_Display:Medium'] leading-[30px] left-0 not-italic text-[25px] text-white top-[21px] whitespace-nowrap" data-node-id="3:885">{"Initial Problem Discovery"}</h2>
      
      <div className="absolute content-stretch flex flex-col h-[231px] items-start left-0 top-[111px] w-[1002px]" data-node-id="3:889" data-name="Container">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:890" data-name="Paragraph">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#7a7a7a] text-[18px] w-[1006px]" data-node-id="3:891"><span className="font-['Inter_Display:Regular'] leading-[21.6px]">Managing a connected home should feel straightforward, yet controls, room navigation and setup can become fragmented. Even a quick light adjustment starts with the need to <em className="homiq-problem-emphasis">find the right device</em> and <em className="homiq-problem-emphasis">understand its state</em>. I wanted to bring these interactions together while keeping device discovery, room selection and routine naming understandable.</span></p>
        </div>
        <div className="h-[22px] relative shrink-0 w-full" data-node-id="3:892" data-name="Paragraph" />
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:893" data-name="Paragraph">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#7a7a7a] text-[18px] w-[1002px]" data-node-id="3:894"><span className="font-['Inter_Display:Regular'] leading-[21.6px]">The difficulty changes with the task: finding an appliance depends on its location, adjusting it depends on a readable state, and creating a routine depends on knowing which devices will respond. When pairing stops, people need to <em className="homiq-problem-emphasis">recover interrupted setup</em> without re-entering the room, name and device choices. That led me toward <em className="homiq-problem-emphasis">recognizable navigation, explicit states and recoverable setup</em>, so configuration could be deliberate without slowing down everyday use.</span></p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col h-[3px] items-start left-[-1px] top-[79px] w-[1004px]" data-node-id="3:895" data-name="Container">
        <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:896" data-name="Icon">
          <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
        </div>
      </div>
    </div>
  );
}
