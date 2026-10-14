// Owner-confirmed October 10, 2026. Keep HTML, structured data and Markdown aligned.
export const biography = {
  title: "Experience Meets Creativity",
  introduction: "I’m Sage Burress, a model & content creator with a decade of experience across commercial, e-commerce, fitness, high fashion, and runway. My work has appeared in multiple magazines and includes collaborations with brands such as Macy’s, Saks Fifth Avenue, and Westcott Lighting.",
  work: "My runway highlights include shows during New York Fashion Week and Paris Fashion Week, Miami Swim Week, and Fashion Week Columbus, among many others.",
  creative: "I love being part of a shoot, and I love coming up with the ideas behind it, too. I work with brands to develop concepts and create photos and videos, with a different approach for each project. Travel is part of that work as well, creating content that gives people a feel for a destination, a place to stay, or an experience to try.",
  local: "I also run Sage’s Shenanigans, offering makeup artistry, henna, and face painting for clients and events in Cincinnati and Mason, Ohio.",
  closing: "Have a campaign, project, or idea in mind?\nI’d love to bring my experience and creativity to it.",
};

export const homeCredibility = "A decade of modeling, magazine features, and runways around the world.";
export const homeCredibilityLines = ["A decade of modeling, magazine features,", "and runways around the world."];
export const localServiceSlugs = ["makeup-artist", "henna", "face-painting"];
export const localServiceIntro = "Sage’s Shenanigans · Cincinnati & Mason, Ohio · Traveling to you";

export type ServiceFaq = { question: string; answer: string; link?: { text: string; href: string } };
type ServiceGuide = { title: string; description: string; faqs: ServiceFaq[] };
export const serviceGuides: Record<string, ServiceGuide> = {
  modeling: {
    title: "Modeling & Runway",
    description: "Book Sage Burress for editorial, commercial and runway modeling. A decade of experience, magazine publications and fashion-week runway work.",
    faqs: [
      { question: "What kind of modeling do you do?", answer: "My work spans commercial, e-commerce, fitness, high fashion, and runway. Over the past decade, that’s included magazine features and shows during New York Fashion Week and Paris Fashion Week, as well as Miami Swim Week and Fashion Week Columbus. You can explore more in my portfolio and agency credits." },
      { question: "Can you send casting information?", answer: "Of course. Share your project details on the contact page and let me know what you need, whether that’s current measurements, portfolio images, or availability.", link: { text: "contact page", href: "/contact" } },
      { question: "Do you travel for shoots?", answer: "Yes. I'm based in Cincinnati, Ohio, and frequently travel for projects, including Los Angeles, New York, Columbus, Miami, and internationally. Let me know what you're thinking and we can talk through possibilities." },
      { question: "What should I include in my inquiry?", answer: "Share your concept, dates, location, expected hours, budget, and where the photos or video will appear. It’s okay if the plan is still taking shape. We’ll work through usage, travel, and final details together before confirming the project." },
    ],
  },
  "content-creation": {
    title: "Content Creation & UGC",
    description: "Photo, video and UGC content with Sage Burress for brands and social platforms. Explore examples and discuss deliverables, usage and your creative brief.",
    faqs: [
      { question: "Can you create content for my brand?", answer: "Yes! I create photos, videos, and UGC for brands, including sponsored collaborations. We can create content for your channels, mine, or both." },
      { question: "Can we use the content in ads?", answer: "Yes, let’s discuss where and how long you’d like to use it. We’ll agree on usage and pricing before we begin." },
      { question: "What if I’m still figuring out the idea?", answer: "That’s okay! Tell me about your brand and what you have in mind. We can develop the idea together." },
      { question: "How do we set goals for a collaboration?", answer: "Tell me what you’d like to achieve and we’ll plan the content around your goals and objectives." },
    ],
  },
  "travel-collaborations": {
    title: "Travel Content & Collaborations",
    description: "Travel storytelling with Sage Burress for destinations, stays and experiences. Discuss photo and video content, campaign scope and travel arrangements.",
    faqs: [
      { question: "Who do you collaborate with?", answer: "I create photos, videos, and social content for places to stay, destinations, and experiences." },
      { question: "How do I suggest a trip or hosted stay?", answer: "Send me the location, possible dates, what you’re offering, and the content you have in mind. We can talk through the details together." },
      { question: "What’s included in a collaboration?", answer: "Each collaboration is different. We’ll agree on the content, social posts, usage, travel arrangements, and timing before confirming." },
      { question: "Can we include modeling or brand content?", answer: "Absolutely! We can combine modeling, brand content, and travel in the same project." },
    ],
  },
  "makeup-artist": {
    title: "Makeup Artist in Cincinnati & Mason",
    description: "Sage’s Shenanigans: makeup artistry in Cincinnati and Mason, Ohio, for events, photography and creative productions. Ask about on-location availability.",
    faqs: [
      { question: "Can you come to my location?", answer: "Yes! I travel to clients around Cincinnati and Ohio. Send me your date and location; other areas may be possible too." },
      { question: "What should I share about the look?", answer: "Send a few inspiration photos, the occasion, and how many people need makeup." },
      { question: "How do I get a quote?", answer: "Share your date, location, group size, and the look you have in mind. We’ll work out pricing and details together." },
      { question: "Can we talk about products beforehand?", answer: "Of course. Let me know about any product preferences or sensitivities before your appointment." },
    ],
  },
  henna: {
    title: "Henna Artist in Cincinnati & Mason",
    description: "Custom henna by Sage’s Shenanigans in Cincinnati and Mason, Ohio. Explore hand-drawn designs and inquire about appointments, celebrations and events.",
    faqs: [
      { question: "Can you bring henna to my event?", answer: "Yes! Through Sage’s Shenanigans, I offer henna around Cincinnati and Mason, Ohio, and travel to clients. Let me know where and when you're planning it." },
      { question: "Can I choose my own design?", answer: "Absolutely. I can go based off a reference or we can craft it together." },
      { question: "What do you need for an event quote?", answer: "Your date, venue, event length, and approximate guest count are a great start. Let me know the style of designs you’re imagining too. That helps us get started and work out the details for your event." },
      { question: "How should I prepare and care for it?", answer: "Ask me about preparation and aftercare when we plan your appointment. We can also talk about ingredients and any sensitivities beforehand." },
    ],
  },
  "face-painting": {
    title: "Face Painting in Cincinnati & Mason",
    description: "Sage’s Shenanigans face painting in Cincinnati and Mason, Ohio, for events and creative projects. Request custom designs and on-location availability.",
    faqs: [
      { question: "Where do you offer face painting?", answer: "I travel to events around Cincinnati and Ohio. Send me your date and location to check availability." },
      { question: "Can the designs match our theme?", answer: "Yes! Share your theme or a few references, and we can choose designs together." },
      { question: "How many guests can you paint?", answer: "It depends on the designs and time available. Share your guest count and event length, and we’ll work out a plan." },
      { question: "What should we plan before the day?", answer: "Let me know whether the event is indoors or outdoors and where I’ll be set up. We’ll confirm timing, space, and any other details before the day." },
    ],
  },
};
