"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export function InquirySelect({ options, initialValue, disabled, onChange }: {
  options: readonly string[]; initialValue: string; disabled?: boolean; onChange: () => void;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(options.indexOf(initialValue));
  const choose = (index: number) => { setValue(options[index]); setOpen(false); onChange(); };

  useEffect(() => {
    const list = root.current?.querySelector<HTMLElement>('[role="listbox"]');
    // Reveal the complete seven-option menu; it has no nested scroll region.
    if (open && list) list.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
    if (event.key === "Tab") { if (open) choose(active); return; }
    if (["Enter", " "].includes(event.key)) {
      event.preventDefault();
      if (open) choose(active); else { setActive(options.indexOf(value)); setOpen(true); }
      return;
    }
    if (["ArrowDown", "ArrowUp", "Home", "End", "PageDown", "PageUp"].includes(event.key)) {
      event.preventDefault(); setOpen(true);
      if (event.key === "Home" || event.key === "PageUp") setActive(0);
      else if (event.key === "End" || event.key === "PageDown") setActive(options.length - 1);
      else setActive(open ? Math.max(0, Math.min(options.length - 1, active + (event.key === "ArrowDown" ? 1 : -1))) : options.indexOf(value));
      return;
    }
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - typeahead.current.time < 700 ? typeahead.current.text : "";
      const typed = previous + event.key.toLowerCase();
      typeahead.current = { text: typed, time: now };
      const repeated = [...typed].every(letter => letter === typed[0]);
      const query = repeated ? typed[0] : typed;
      const start = repeated ? active + 1 : 0;
      const match = options.map((_, index) => (start + index) % options.length).find(index => options[index].toLowerCase().startsWith(query));
      if (match !== undefined) { setActive(match); setOpen(true); }
    }
  }

  return <div className="inquiry-select" ref={root} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <label id={`${id}-label`} htmlFor={`${id}-button`}>What can I help with?</label>
    <input type="hidden" name="inquiry" value={value} />
    <button id={`${id}-button`} ref={button} className="inquiry-select__trigger" type="button" role="combobox" aria-labelledby={`${id}-label`} aria-expanded={open} aria-controls={`${id}-list`} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-${active}` : undefined} disabled={disabled}
      onClick={() => { setActive(options.indexOf(value)); setOpen(!open); }} onKeyDown={onKeyDown}>
      <span>{value}</span><ChevronDown size={18} aria-hidden="true" />
    </button>
    <ul id={`${id}-list`} className="inquiry-select__list" role="listbox" aria-labelledby={`${id}-label`} hidden={!open}>
      {options.map((option, index) => <li id={`${id}-${index}`} key={option} role="option" aria-selected={value === option} data-active={index === active} onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => { choose(index); button.current?.focus(); }}>
        <span>{option}</span>{value === option && <Check size={16} aria-hidden="true" />}
      </li>)}
    </ul>
  </div>;
}
