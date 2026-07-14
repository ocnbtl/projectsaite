type SectionIntroProps = {
  index?: string;
  label: string;
  title: string;
  copy?: string;
  align?: "left" | "center";
};

export function SectionIntro({ index, label, title, copy, align = "left" }: SectionIntroProps) {
  return (
    <header className={`section-intro section-intro--${align}`}>
      <div className="section-intro__label">
        {index ? <span>{index}</span> : null}
        <p className="ui-label">{label}</p>
      </div>
      <h2>{title}</h2>
      {copy ? <p className="section-intro__copy">{copy}</p> : null}
    </header>
  );
}
