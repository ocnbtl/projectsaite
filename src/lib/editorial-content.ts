// Owner-confirmed October 10, 2026. Keep HTML, structured data and Markdown aligned.
export const biography = {
  title: "Experience Meets Creativity",
  introduction: "I’m Sage Burress, a model & content creator with a decade of experience across commercial, e-commerce, fitness, high fashion, and runway. My work has appeared in multiple magazines and includes collaborations with brands such as Macy’s, Saks Fifth Avenue, and Westcott Lighting.",
  work: "My runway highlights include shows during New York Fashion Week and Paris Fashion Week, Miami Swim Week, and Fashion Week Columbus, among many others.",
  creative: "I love being part of a shoot, and I love coming up with the ideas behind it, too. I work with brands to develop concepts and create photos and videos, with a different approach for each project. Travel is part of that work as well, creating content that gives people a feel for a destination, a place to stay, or an experience to try.",
  local: "I also run Sage’s Shenanigans, offering makeup artistry, henna, and face painting for clients and events in Cincinnati and Mason, Ohio.",
  closing: "Have a campaign, a destination, or a celebration in mind? Let’s create something that feels like you.",
};

export const homeCredibility = "A decade of modeling, magazine features, and runways around the world.";
export const homeCredibilityLines = ["A decade of modeling, magazine features,", "and runways around the world."];
export const localServiceSlugs = ["makeup-artist", "henna", "face-painting"];
export const localServiceIntro = "Sage’s Shenanigans · Cincinnati & Mason, Ohio · Traveling to you";

type ServiceGuide = { title: string; description: string; faqs: { question: string; answer: string }[] };
export const serviceGuides: Record<string, ServiceGuide> = {
  modeling: {
    title: "Modeling & Runway",
    description: "Book Sage Burress for editorial, commercial and runway modeling. A decade of experience, magazine publications and fashion-week runway work.",
    faqs: [
      { question: "What kind of modeling do you do?", answer: "My work spans commercial, e-commerce, fitness, high fashion, and runway. Over the past decade, that’s included magazine features and shows during New York Fashion Week and Paris Fashion Week, as well as Miami Swim Week and Fashion Week Columbus. You can explore more in my portfolio and agency credits." },
      { question: "Can you send casting information?", answer: "Of course. Send me your casting brief and let me know what you need, whether that’s current measurements, portfolio images, or availability. The client, shoot type, date, and location are a helpful place to start." },
      { question: "Do you travel for shoots?", answer: "Yes. I work around Cincinnati and Mason, Ohio, and travel for projects, including Los Angeles and New York. Tell me where you’re shooting and the dates you have in mind, and we can talk through the possibilities." },
      { question: "What should I include in my inquiry?", answer: "Share your concept, dates, location, expected hours, budget, and where the photos or video will appear. It’s okay if the plan is still taking shape. We’ll work through usage, travel, and booking details together before confirming the project." },
    ],
  },
  "content-creation": {
    title: "Content Creation & UGC",
    description: "Photo, video and UGC content with Sage Burress for brands and social platforms. Explore examples and discuss deliverables, usage and your creative brief.",
    faqs: [
      { question: "Can you create content for my brand?", answer: "Yes! I create photo, video, and UGC for brands, as well as sponsored collaborations. Let me know whether you’d like content for your own channels, a post on mine, or a little of both, and we’ll shape the project around that." },
      { question: "Can we use the content in ads?", answer: "Let’s talk about how you’d like to use it. Share the platforms, timeframe, and whether paid ads, posting, or exclusivity are part of the plan. We’ll agree on the right usage and permissions before creating the content." },
      { question: "What if I’m still figuring out the idea?", answer: "That’s a good place to start a conversation. Tell me about your brand, who you want to reach, and what you’d like the content to do. A few references, your timeline, and a budget help us turn the idea into a clear plan, including deliverables and revisions." },
      { question: "How do we set goals for a collaboration?", answer: "We’ll start with what matters to your brand and agree on the content and how you’ll evaluate it. Views and sales can vary, so I don’t promise a particular result. The focus is on thoughtful creative work with a clear purpose." },
    ],
  },
  "travel-collaborations": {
    title: "Travel Content & Collaborations",
    description: "Travel storytelling with Sage Burress for destinations, stays and experiences. Discuss photo and video content, campaign scope and travel arrangements.",
    faqs: [
      { question: "Who do you collaborate with?", answer: "I’m interested in working with stays, destinations, and experiences that have a story to tell. We can talk about photography, video, and social content that brings your place to life. My role is creating content, rather than arranging travel bookings for guests." },
      { question: "How do I suggest a trip or hosted stay?", answer: "Tell me about your property or experience, where it is, and the dates you’re considering. Include your ideas, budget, what you’re offering, and the content you’d love to create. We can then see whether the timing and project are a good fit." },
      { question: "What’s included in a collaboration?", answer: "Every trip is a little different. We’ll agree on the photos or videos, any social posts, usage rights, travel arrangements, and delivery dates together. A hosted invitation is the start of that conversation, not an automatic commitment to specific content." },
      { question: "Can we include modeling or brand content?", answer: "Absolutely—tell me the whole idea. Modeling, content creation, and travel often belong in the same story. We can discuss the different pieces together and build one clear brief for the project." },
    ],
  },
  "makeup-artist": {
    title: "Makeup Artist in Cincinnati & Mason",
    description: "Sage’s Shenanigans: makeup artistry in Cincinnati and Mason, Ohio, for events, photography and creative productions. Ask about on-location availability.",
    faqs: [
      { question: "Can you come to my location?", answer: "Yes, I travel to clients around Cincinnati and Mason, Ohio, through Sage’s Shenanigans. Send your date and location so we can check availability. If you’re a little farther away, you’re welcome to ask about travel too." },
      { question: "What should I share about the look?", answer: "A few inspiration photos are always helpful. Tell me what the occasion is, how many people need makeup, and when everyone needs to be ready. Whether it’s an event, a shoot, or a creative concept, we can talk through the look together." },
      { question: "How do I get a quote?", answer: "Send me your date, location, group size, and the look you have in mind. I’ll use those details to discuss pricing and timing with you, including setup and travel. We’ll confirm the arrangements together before your appointment is booked." },
      { question: "Can we talk about products beforehand?", answer: "Of course. Please share any product preferences or sensitivities before we confirm your appointment. We can talk about the products and what may suit you, rather than assuming the same approach works for everyone." },
    ],
  },
  henna: {
    title: "Henna Artist in Cincinnati & Mason",
    description: "Custom henna by Sage’s Shenanigans in Cincinnati and Mason, Ohio. Explore hand-drawn designs and inquire about appointments, celebrations and events.",
    faqs: [
      { question: "Can you bring henna to my event?", answer: "Yes! Through Sage’s Shenanigans, I offer henna around Cincinnati and Mason, Ohio, and travel to clients. Tell me where and when you’re planning it, and whether it’s a personal appointment or a celebration with guests." },
      { question: "Can I choose my own design?", answer: "Absolutely. Send a few references and tell me where you’d like the design, how large it should be, and the level of detail you love. We can shape it together and allow the right amount of time." },
      { question: "What do you need for an event quote?", answer: "Your date, venue, event length, and approximate guest count are a great start. Let me know the style of designs you’re imagining too. That helps us plan a comfortable pace and work out what’s realistic for your event." },
      { question: "How should I prepare and care for it?", answer: "Ask me about preparation and aftercare when we plan your appointment. We can also talk about ingredients and any sensitivities beforehand. The way a stain develops and how long it lasts can vary, so we’ll keep your event timing in mind." },
    ],
  },
  "face-painting": {
    title: "Face Painting in Cincinnati & Mason",
    description: "Sage’s Shenanigans face painting in Cincinnati and Mason, Ohio, for events and creative projects. Request custom designs and on-location availability.",
    faqs: [
      { question: "Where do you offer face painting?", answer: "I travel to events and creative projects around Cincinnati and Mason, Ohio, through Sage’s Shenanigans. Share your venue and date, and we can check availability and talk through any travel details." },
      { question: "Can the designs match our theme?", answer: "Yes—tell me what you’re planning! Share your theme, any inspiration, the age range, and roughly how many people will take part. We can choose designs that fit the occasion and the time available." },
      { question: "How many guests can you paint?", answer: "It depends on how detailed the designs are and how long you’d like me there. Send your guest count and schedule, and we’ll make a realistic plan so the experience feels enjoyable rather than rushed." },
      { question: "What should we plan before the day?", answer: "We’ll talk through space, timing, indoor or outdoor setup, and pricing before confirming your event. You’re welcome to ask about products and removal too. Please mention any sensitivities in advance so we can discuss suitability." },
    ],
  },
};
