// Shared knowledge base for Regenesys PrivateGPT
export const knowledgeBase = {
  programmes: "We offer 7 flagship programmes:\n\n• **Role Based Programmes** — Tailored per job function\n• **Data Zen Master** — Advanced analytics & data governance\n• **Technology Stack** — Full-stack development & architecture\n• **Gen AI Academy** — Generative AI for business\n• **Fresher's Talent Transformation** — Campus to corporate\n• **Leadership Mastery Suite** — From manager to CXO\n• **ESG Programme** — Sustainability & governance\n\nEach can be customised to your organisation's specific needs and scale.",
  enrol: "**Enrolment Process:**\n\n1. Click 'Get Started' or 'Enrol Now' on our website\n2. Fill in your details and training interest\n3. A Regenesys expert will contact you within 24 hours\n4. We'll customise a programme for your team\n\nYou can also reach us directly:\n📧 Regenesys.consulting@regenesys.net\n📞 +91 9773456788",
  ai: "**The Gen AI Academy** focuses on:\n\n• Integration of generative AI tools for business optimisation\n• AI-driven solutions for data analysis & decision-making\n• Practical implementation of AI strategies across functions\n• Hands-on labs with the latest LLM tools\n\nIdeal for IT managers, data teams, and business leaders wanting to harness AI for competitive advantage.",
  fee: "Our pricing is **bespoke** — we tailor programmes to your organisation's size, industry, and learning objectives.\n\n**Factors that influence pricing:**\n• Number of participants\n• Programme duration & format (online/offline/blended)\n• Level of customisation required\n• Industry-specific content additions\n\nContact us at **+91 9773456788** for a personalised quote.",
  esg: "**The ESG Programme** covers:\n\n• Master the essentials of sustainability reporting\n• Drive impactful change with practical ESG strategies\n• Lead with a global perspective on environmental and social governance\n• Understand regulatory frameworks and compliance requirements\n\nDesigned for board members, C-suite executives, and sustainability officers.",
  leadership: "**Leadership Mastery Suite** includes:\n\n• Strategic thinking & decision-making for senior leaders\n• Advanced communication and team management\n• Innovation & adaptability in dynamic business environments\n• Women in Leadership specialised track\n• Executive coaching and mentorship\n\nOver 40+ women leaders trained through our Tata Steel partnership alone.",
  data: "**Data Zen Master** programme covers:\n\n• Advanced data analytics & visualisation techniques\n• Data governance, security & ethical considerations\n• Big data technologies for strategic decision-making\n• Python, R, SQL, and Tableau hands-on workshops\n• Real-world case studies from BFSI and manufacturing sectors",
  about: "**Regenesys Corporate Education** is part of Regenesys, a Global Educational Institution with 25+ years of legacy.\n\n**Key Facts:**\n• 2000+ participants trained across industries\n• 100+ batches conducted\n• 5000+ hours of transformative learning\n• Clients include Tata Steel, CRISIL, HDFC Bank, Bajaj Finserv, Hindalco\n\nWe specialise in IT/ITES, BPO, GCC, and manufacturing sectors.",
  technology: "**Technology Stack** programme includes:\n\n• Full Stack Development (Java, Django, Mobile App)\n• Cloud computing & DevOps\n• System architecture & integration\n• Cybersecurity fundamentals\n• Agile & Scrum methodologies\n\n54 participants trained across 3 batches with 510+ total training hours.",
  fresher: "**Fresher's Talent Transformation Programme:**\n\n• Bridge the gap from campus to corporate\n• Essential technical & soft skills training\n• Hands-on projects & real-world simulations\n• Mentorship from industry experts\n• Corporate communication & professional etiquette\n\nDesigned to make fresh graduates workplace-ready from day one."
};

export const getAIResponse = (query) => {
  const lower = query.toLowerCase();
  let text;
  let suggestions;

  if (lower.includes('programme') || lower.includes('program') || lower.includes('course') || lower.includes('offer')) {
    text = knowledgeBase.programmes;
    suggestions = ["How do I enrol?", "What is the fee structure?", "Tell me about leadership programmes"];
  } else if (lower.includes('enrol') || lower.includes('enroll') || lower.includes('register') || lower.includes('join') || lower.includes('start')) {
    text = knowledgeBase.enrol;
    suggestions = ["What are the fees?", "Available programmes", "Contact details"];
  } else if (lower.includes('gen ai') || lower.includes('artificial intelligence') || lower.includes('genai') || lower.includes('llm')) {
    text = knowledgeBase.ai;
    suggestions = ["Who is this for?", "Programme duration?", "Prerequisites for Gen AI"];
  } else if (lower.includes('fee') || lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
    text = knowledgeBase.fee;
    suggestions = ["Discount for groups?", "Enrolment process", "Payment methods"];
  } else if (lower.includes('esg') || lower.includes('sustainability') || lower.includes('environment')) {
    text = knowledgeBase.esg;
    suggestions = ["Is there a certification?", "Case studies", "Who should attend?"];
  } else if (lower.includes('leader') || lower.includes('management') || lower.includes('executive')) {
    text = knowledgeBase.leadership;
    suggestions = ["Women in leadership", "Strategic thinking modules", "Executive coaching"];
  } else if (lower.includes('data') || lower.includes('analytics') || lower.includes('zen')) {
    text = knowledgeBase.data;
    suggestions = ["Tools covered?", "Is Python required?", "Data security modules"];
  } else if (lower.includes('about') || lower.includes('regenesys') || lower.includes('company') || lower.includes('who')) {
    text = knowledgeBase.about;
    suggestions = ["Our clients", "Flagship programmes", "Company history"];
  } else if (lower.includes('tech') || lower.includes('stack') || lower.includes('development') || lower.includes('coding')) {
    text = knowledgeBase.technology;
    suggestions = ["Full stack details", "Cybersecurity modules", "Cloud computing"];
  } else if (lower.includes('fresher') || lower.includes('campus') || lower.includes('graduate') || lower.includes('talent')) {
    text = knowledgeBase.fresher;
    suggestions = ["Soft skills modules", "Mentorship details", "How to apply"];
  } else {
    text = "I've searched our internal knowledge base regarding your query. Regenesys Corporate Education offers world-class bespoke training programmes across India.\n\nFor specific enquiries, contact us at **+91 9773456788** or email **Regenesys.consulting@regenesys.net**.";
    suggestions = ["Available programmes", "Gen AI Academy", "Fee structure"];
  }

  return { text, suggestions };
};
