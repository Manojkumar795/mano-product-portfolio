/* Homiq content inside the preserved editorial section geometry. */

const imgImage = "/homiq/artifacts/342-imgImage.svg";
const imgImage1 = "/homiq/artifacts/342-imgImage1.svg";
const imgImage2 = "/homiq/artifacts/342-imgImage2.svg";
const imgImage4 = "/homiq/artifacts/342-imgImage4.svg";
const imgImage5 = "/homiq/artifacts/342-imgImage5.svg";
const imgImage9 = "/homiq/artifacts/342-imgImage9.svg";
const imgImage10 = "/homiq/artifacts/342-imgImage10.svg";
const imgIcon = "/homiq/editorial/342-imgIcon.svg";

export default function Section342() {
  return (
    <div className="relative size-full" data-node-id="3:342" data-name="Container">
      <h2 className="[word-break:break-word] absolute font-['Inter_Display:Medium'] leading-[30px] left-px not-italic text-[25px] text-white top-[21px] whitespace-nowrap" data-node-id="3:343">{"Research & Quantitative UX Audit"}</h2>
      
      <div className="absolute content-stretch flex flex-col h-[63px] items-start left-px top-[111px] w-[1002px]" data-node-id="3:347" data-name="Container">
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="3:348" data-name="Paragraph">
          <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[0] not-italic relative shrink-0 text-[#7a7a7a] text-[18px] w-[1002px]" data-node-id="3:349"><span className="font-['Inter_Display:Regular'] leading-[21.6px] text-white">A screen audit covered </span><span className="font-['Inter_Display:Regular'] leading-[21.6px]">29 HOMIQ screens across six product areas. I traced </span><span className="font-['Inter_Display:Regular'] leading-[21.6px] text-white">navigation, control states and setup completion</span><span className="font-['Inter_Display:Regular'] leading-[21.6px]"> to see where context was retained and where setup introduced choices. The journey counts and 0–8 rubric helped compare the paths and feedback visible in the designs.</span></p>
        </div>
      </div>
      <div className="absolute content-stretch flex flex-col h-[3px] items-start left-0 top-[80px] w-[1004px]" data-node-id="3:350" data-name="Container">
        <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:351" data-name="Icon">
          <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
        </div>
      </div>
      <div className="absolute bg-[#ececec] h-[1671px] left-px rounded-[10px] top-[234px] w-[1002px]" data-node-id="3:354" data-name="Container">
        <div className="absolute h-[258.5px] left-[26px] rounded-[10px] top-[25px] w-[470px]" data-node-id="3:355" data-name="Image">
          <img loading="lazy" decoding="async" alt="Journey length: device setup 5 screens, room creation 4, scene creation 5, account recovery 3." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage} />
        </div>
        <div className="absolute h-[300.797px] left-[26px] rounded-[10px] top-[296px] w-[470px]" data-node-id="3:356" data-name="Image">
          <img loading="lazy" decoding="async" alt="Visible fields: device setup 1, room creation 1, scene creation 1, account recovery 4." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage1} />
        </div>
        <div className="absolute h-[229.359px] left-[506px] rounded-[10px] top-[609px] w-[470px]" data-node-id="3:357" data-name="Image">
          <img loading="lazy" decoding="async" alt="Repeated components: navigation on 9 screens, progress on 8, named confirmations on 3." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage2} />
        </div>
        <div className="absolute h-[226.539px] left-[506px] rounded-[10px] top-[851px] w-[470px]" data-node-id="3:359" data-name="Image">
          <img loading="lazy" decoding="async" alt="Control evidence scores out of 8: AC 6, lamp 5, TV 5." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage4} />
        </div>
        <div className="absolute h-[571.516px] left-[506px] rounded-[10px] top-[25px] w-[470px]" data-node-id="3:360" data-name="Image">
          <img loading="lazy" decoding="async" alt="Visible control counts by screen, excluding fields." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage5} />
        </div>
        <div className="absolute h-[555.891px] left-[26px] rounded-[10px] top-[1090px] w-[950px]" data-node-id="3:364" data-name="Image">
          <img loading="lazy" decoding="async" alt="Screen-count definitions, decision stages and the 0–8 control rubric." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage9} />
        </div>
        <div className="absolute h-[468px] left-[26px] rounded-[10px] top-[609px] w-[470px]" data-node-id="3:366" data-name="Image">
          <img loading="lazy" decoding="async" alt="Product coverage: Entry 6, Rooms 7, Setup 5, Controls 3, Scenes 5, Account 3. Total 29 screens." className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[10px] size-full" src={imgImage10} />
        </div>
      </div>
    </div>
  );
}
