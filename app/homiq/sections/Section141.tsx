/* Homiq content inside the preserved editorial section geometry. */

const imgIcon = "/homiq/editorial/141-imgIcon.svg";

export default function Section141() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-node-id="3:141" data-name="Container">
      <div className="h-[3px] overflow-clip relative shrink-0 w-full" data-node-id="3:142" data-name="Icon">
        <img loading="lazy" decoding="async" alt="" className="absolute block inset-0 max-w-none size-full" src={imgIcon} />
      </div>
    </div>
  );
}
