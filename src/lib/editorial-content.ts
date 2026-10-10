// Owner-confirmed October 10, 2026. Keep HTML, structured data and Markdown aligned.
export const biography = {
  title: "A decade in modeling.",
  introduction: "I’m Sage Burress, a model & content creator with a decade of experience across commercial, e-commerce, fitness, high fashion, and runway. My work has appeared in multiple magazines, and I’ve worked with Macy’s, Saks Fifth Avenue, and Westcott Lighting.",
  work: "My runway highlights include shows during New York Fashion Week and Paris Fashion Week, Miami Swim Week, and Fashion Week Columbus, among many others. Beyond the runway, I bring that same creative energy to brand content and travel storytelling.",
  local: "Closer to home, Sage’s Shenanigans is my creative side: makeup artistry, henna, and face painting for people and events in Cincinnati and Mason, Ohio. I travel to clients as needed.",
};

export const homeCredibility = "A decade of modeling. Published in multiple magazines. Runway highlights include shows during New York Fashion Week and Paris Fashion Week, Miami Swim Week, and Fashion Week Columbus, among many others.";
export const localServiceSlugs = ["makeup-artist", "henna", "face-painting"];
export const localServiceIntro = "Sage’s Shenanigans · Cincinnati & Mason, Ohio · Traveling to you";

type ServiceGuide = { title: string; description: string; faqs: { question: string; answer: string }[] };
export const serviceGuides: Record<string, ServiceGuide> = {
  modeling: {
    title: "Modeling & Runway",
    description: "Book Sage Burress for editorial, commercial and runway modeling. A decade of experience, magazine publications and fashion-week runway work.",
    faqs: [
      { question: "What experience does Sage bring to a booking?", answer: "Sage has a decade of modeling experience, magazine publications, and runway credits at shows during New York and Paris Fashion Weeks, Miami Swim Week, and Fashion Week Columbus. Her work also includes educational-video modeling for Xavier University and the University of Cincinnati." },
      { question: "Can agencies and casting teams request portfolio information?", answer: "Yes. Use the contact page to share your casting brief and request the portfolio information, current measurements, or availability you need. Include the client, shoot type, date, and location so the inquiry can be directed appropriately." },
      { question: "Does Sage travel for modeling work?", answer: "Sage works around Cincinnati and Mason, Ohio, and travels for projects, including work in Los Angeles and New York. Share your location and dates to discuss availability and travel arrangements before booking." },
      { question: "What should a modeling brief include?", answer: "Include the creative concept, client or agency, location, dates, expected hours, budget, and where the images or video will be used. Usage, exclusivity, travel, and booking terms need to be agreed for the specific project; an inquiry does not reserve a date." },
    ],
  },
  "content-creation": {
    title: "Content Creation & UGC",
    description: "Photo, video and UGC content with Sage Burress for brands and social platforms. Explore examples and discuss deliverables, usage and your creative brief.",
    faqs: [
      { question: "Can I commission content for my brand’s own channels?", answer: "Yes. Sage offers UGC and brand content as well as sponsored collaborations. Say whether you need assets for your own channels, a post on Sage’s channels, or both; these are different project requirements." },
      { question: "Are posting, paid-ad usage and exclusivity included?", answer: "Do not assume they are included. Outline the platforms, usage period, paid advertising, posting expectations, and any exclusivity in your brief so the scope and permissions can be agreed before the project." },
      { question: "What information helps scope a content project?", answer: "Share your brand, audience, campaign goal, examples, preferred formats, number of deliverables, deadline, and budget. If filming is on location, include the destination and dates. Ask about revisions and delivery timing as part of the brief." },
      { question: "Can a collaboration guarantee views or sales?", answer: "No particular reach, sales result, or audience response is promised. Start with a clear creative goal and agree on deliverables and how the work will be evaluated." },
    ],
  },
  "travel-collaborations": {
    title: "Travel Content & Collaborations",
    description: "Travel storytelling with Sage Burress for destinations, stays and experiences. Discuss photo and video content, campaign scope and travel arrangements.",
    faqs: [
      { question: "Who are travel collaborations for?", answer: "These projects are for properties, destinations, and experience providers seeking travel photography, video, or social storytelling. This is a creative collaboration service, not a travel-booking agency." },
      { question: "How do I propose a destination or hosted stay?", answer: "Send the property or experience name, location, possible dates, campaign goal, budget, and proposed arrangements. Clearly identify what is offered and what content is expected. Availability and acceptance are confirmed individually." },
      { question: "Does a stay automatically include social posts or advertising rights?", answer: "No. Deliverables, posting, content usage, travel costs, accommodation, deadlines, and any exclusivity should be agreed in advance. A hosted invitation or an inquiry alone is not a confirmed collaboration." },
      { question: "Can travel content be combined with modeling or brand content?", answer: "Share the full creative brief if your project combines these services. Sage’s portfolio spans modeling, content creation, and travel, so the scope can be discussed together instead of treating each deliverable as a separate inquiry." },
    ],
  },
  "makeup-artist": {
    title: "Makeup Artist in Cincinnati & Mason",
    description: "Sage’s Shenanigans: makeup artistry in Cincinnati and Mason, Ohio, for events, photography and creative productions. Ask about on-location availability.",
    faqs: [
      { question: "Where can I book Sage for makeup?", answer: "Sage’s Shenanigans serves Cincinnati and Mason, Ohio, traveling to clients as needed. Include your venue or general location when asking about availability. Other locations and travel arrangements are discussed individually." },
      { question: "What should I send when requesting makeup for an event or shoot?", answer: "Include the date, location, number of people, ready-by time, and references for the look you want. Say whether it is for an event, photography, video, runway, or a creative concept." },
      { question: "How are pricing and appointment timing confirmed?", answer: "Request a quote for your specific look, group size, schedule, and location. Ask about preparation, setup, and any travel requirements before confirming; a message alone does not reserve an appointment." },
      { question: "Can I discuss product preferences or sensitivities first?", answer: "Yes. Ask about products and suitability before booking, and mention any preferences or concerns directly to Sage. Do not assume a product or service is suitable for every person." },
    ],
  },
  henna: {
    title: "Henna Artist in Cincinnati & Mason",
    description: "Custom henna by Sage’s Shenanigans in Cincinnati and Mason, Ohio. Explore hand-drawn designs and inquire about appointments, celebrations and events.",
    faqs: [
      { question: "Does Sage offer henna at my location?", answer: "Sage’s Shenanigans offers henna around Cincinnati and Mason, Ohio, traveling to clients as needed. Share the location, date, and whether you are planning an individual appointment or an event." },
      { question: "Can I request a custom design?", answer: "Yes. Send references and describe the placement, size, and level of detail you have in mind. The design and time required can then be discussed for your appointment or event." },
      { question: "What information is needed for a henna event quote?", answer: "Include the venue, date, event duration, approximate guest count, and the style of designs you want. Ask about realistic capacity and scheduling rather than assuming every guest can receive the same level of detail." },
      { question: "What should I ask about preparation and aftercare?", answer: "Ask Sage about the product being used, ingredients, preparation, aftercare, and how to plan around your event. Mention any sensitivities before booking; stain appearance and duration should not be treated as guaranteed." },
    ],
  },
  "face-painting": {
    title: "Face Painting in Cincinnati & Mason",
    description: "Sage’s Shenanigans face painting in Cincinnati and Mason, Ohio, for events and creative projects. Request custom designs and on-location availability.",
    faqs: [
      { question: "Where is face painting available?", answer: "Sage’s Shenanigans serves Cincinnati and Mason, Ohio, traveling to clients for events and creative projects. Include your venue and dates to check availability and discuss any travel arrangements." },
      { question: "Can the designs match an event theme?", answer: "Yes. Share your theme and design references, along with the age range and approximate number of participants. Designs and the time available can be discussed together before booking." },
      { question: "How many guests can be painted at an event?", answer: "Capacity depends on the design detail and booking duration. Send your expected guest count and event schedule so Sage can discuss a realistic plan. No fixed guests-per-hour rate is promised here." },
      { question: "What should I confirm before the event?", answer: "Discuss setup space, indoor or outdoor conditions, timing, pricing, and product suitability. Ask about removal and any participant sensitivities in advance. Your event is confirmed only once the arrangements are agreed." },
    ],
  },
};
