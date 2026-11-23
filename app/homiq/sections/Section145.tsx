/* Homiq content inside the preserved editorial section geometry. */

const imgIcon = "/homiq/editorial/145-imgIcon.svg";

export default function Section145() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-node-id="3:145" data-name="Container">
      <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:146" data-name="Icon">
        <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
      </div>
    </div>
  );
}
