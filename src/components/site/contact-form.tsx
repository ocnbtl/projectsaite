"use client";

import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { track } from "@/lib/analytics";

const inquiryOptions = [
  "Modeling",
  "Content Creation",
  "Makeup Artist",
  "Travel Promotions",
  "Henna",
  "Face Painting",
  "Something else",
] as const;

type FormState = "idle" | "sending" | "sent" | "fallback" | "error";

export function ContactForm({ initialInquiry = "Content Creation" }: { initialInquiry?: string }) {
  const [state, setState] = useState<FormState>("idle");
  const started = useRef(false);
  const submitting = useRef(false);
  const validationTracked = useRef(false);
  const [fallbackHref, setFallbackHref] = useState("mailto:contact@sageburress.com");
  const normalizedInitialInquiry = initialInquiry === "Travel Collaborations" ? "Travel Promotions" : initialInquiry;
  const selectedInquiry = inquiryOptions.includes(normalizedInitialInquiry as (typeof inquiryOptions)[number])
    ? normalizedInitialInquiry
    : "Content Creation";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    track("contact_submit_attempted");
    validationTracked.current = false;
    setState("sending");
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; code?: string; delivery?: string };

      if (response.ok && result.ok && result.delivery === "accepted") {
        track("contact_submit_succeeded");
        setState("sent");
        form.reset();
        return;
      }

      if (result.code === "delivery_not_configured") {
        track("contact_submit_failed", { reason: "delivery_not_configured" });
        const subject = encodeURIComponent(`${String(payload.inquiry)} inquiry from ${String(payload.name)}`);
        const body = encodeURIComponent(`${String(payload.message)}\n\nFrom: ${String(payload.name)} <${String(payload.email)}>`);
        setFallbackHref(`mailto:contact@sageburress.com?subject=${subject}&body=${body}`);
        setState("fallback");
        return;
      }

      const reason = result.code === "invalid_form" || result.code === "rate_limited" || result.code === "delivery_failed" ? result.code : "unexpected_response";
      track("contact_submit_failed", { reason });
      setState("error");
    } catch {
      track("contact_submit_failed", { reason: "network" });
      setState("error");
    } finally {
      submitting.current = false;
    }
  }

  if (state === "sent") {
    return (
      <div className="form-confirmation" role="status">
        <span><Check size={20} /></span>
        <p className="ui-label">Message received</p>
        <h2>Thank you for reaching out.</h2>
        <p>Sage will review the details and respond from contact@sageburress.com.</p>
        <button className="text-link" type="button" onClick={() => { started.current = false; setState("idle"); }}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form className="contact-form ph-no-capture" data-analytics-private onSubmit={handleSubmit}
      onInput={() => { validationTracked.current = false; if (!started.current) started.current = track("contact_form_started"); }}
      onInvalid={() => { if (!validationTracked.current) validationTracked.current = track("contact_validation_failed", { reason: "invalid_form" }); }}>
      <div className="contact-form__row">
        <label>
          <span>Name</span>
          <input name="name" type="text" autoComplete="name" minLength={2} maxLength={100} required />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" maxLength={254} required />
        </label>
      </div>

      <label>
        <span>What can Sage help with?</span>
        <select name="inquiry" defaultValue={selectedInquiry} required>
          {inquiryOptions.map((option) => <option key={option}>{option}</option>)}
        </select>
      </label>

      <label>
        <span>Project details</span>
        <textarea
          name="message"
          rows={7}
          minLength={20}
          maxLength={5000}
          placeholder="Tell me what you have in mind. Share whatever you know right now, and I can help shape the rest."
          required
        />
      </label>

      <label className="contact-form__honeypot" aria-hidden="true">
        <span>Website</span>
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="contact-form__footer">
        <button className="button button--dark" type="submit" disabled={state === "sending"}>
          {state === "sending" ? <LoaderCircle className="spin" size={18} /> : <ArrowUpRight size={18} />}
          {state === "sending" ? "Sending" : "Send inquiry"}
        </button>
      </div>

      {state === "fallback" && (
        <p className="form-message form-message--notice" role="status">
          Online delivery is being configured. <a href={fallbackHref}>Open this message in your email app</a> instead.
        </p>
      )}
      {state === "error" && (
        <p className="form-message form-message--error" role="alert">
          The message could not be sent. Please email <a href="mailto:contact@sageburress.com">contact@sageburress.com</a>.
        </p>
      )}
    </form>
  );
}
