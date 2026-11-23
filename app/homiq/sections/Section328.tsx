/* Homiq content inside the preserved editorial section geometry. */

import { CompetitorComparison } from "../components/CompetitorComparison";
const imgIcon = "/homiq/editorial/328-imgIcon.svg";

export default function Section328() {
  return (
    <div className="relative size-full" data-node-id="3:328" data-name="Container">
      <div className="absolute h-[614px] left-0 top-[21px] w-[1002px]" data-node-id="3:329" data-name="Container">
        <h2 className="[word-break:break-word] absolute font-['Inter_Display:Medium'] leading-[30px] left-0 not-italic text-[25px] text-white top-0 whitespace-nowrap" data-node-id="3:330">{"Competitor Analysis"}</h2>
        <div className="absolute content-stretch flex flex-col h-[63px] items-start left-0 top-[89.99px] w-[1002px]" data-node-id="3:331" data-name="Container">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:332" data-name="Paragraph">
            <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#7a7a7a] text-[18px] w-[1002px]" data-node-id="3:333"><span className="font-['Inter_Display:Regular'] leading-[21.6px]">Apple Home, Google Home and SmartThings offered different approaches to </span><span className="font-['Inter_Display:Regular'] leading-[21.6px] text-white">everyday control and routines</span><span className="font-['Inter_Display:Regular'] leading-[21.6px]">. I used that comparison to keep HOMIQ’s room navigation familiar and its manual scenes explicit.</span></p>
          </div>
        </div>
        <div className="absolute content-stretch flex flex-col h-[3px] items-start left-[-1px] top-[58px] w-[1004px]" data-node-id="3:334" data-name="Container">
          <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:335" data-name="Icon">
            <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
          </div>
        </div>
        <div className="absolute h-[401px] left-0 rounded-[10px] top-[213px] w-[1002px]" data-node-id="3:338" data-name="Image">
          <CompetitorComparison />
        </div>
      </div>
      
    </div>
  );
}
