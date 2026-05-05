// Shared knowledge base for Regenesys PrivateGPT
export const knowledgeBase = {
  programmes: "Based on our internal documents, Regenesys offers 7 flagship enterprise-grade programmes designed for various organizational roles:\n\n• **Gen AI Academy** — Master Generative AI for business optimization and decision-making.\n• **Data Zen Master** — Advanced analytics, governance, and visualization using Python, R, and Tableau.\n• **Technology Stack** — End-to-end full-stack development, cloud architecture, and cybersecurity.\n• **Leadership Mastery Suite** — Strategic thinking and executive coaching for future-ready leaders.\n• **Role Based Programmes** — Custom-tailored training mapped specifically to your team's job functions.\n• **ESG Programme** — Master sustainability reporting and drive impactful environmental strategies.\n• **Fresher's Talent Transformation** — Bridging the campus-to-corporate gap for new graduates.\n\nWhich of these would you like to explore in more detail?",
  
  enrol: "**Enrolment & Onboarding Process:**\n\nTo begin your organization's transformation journey, follow these steps:\n\n1. **Consultation:** Click 'Get Started' on the main portal to share your team's requirements.\n2. **Strategy Call:** A Regenesys learning consultant will reach out within 24 hours to map out a bespoke curriculum.\n3. **Pilot Program:** We often start with a pilot batch to ensure the learning outcomes align with your KPIs.\n4. **Scale:** Once validated, we scale the training across your global teams.\n\n**Direct Contacts:**\n📧 Regenesys.consulting@regenesys.net\n📞 +91 9773456788 (Corporate HQ)",
  
  ai: "Our **Gen AI Academy** is one of our most requested specializations. Our internal reports show a significant efficiency gain in organizations that have implemented these strategies.\n\n**Key Learning Tracks:**\n• **Business Optimization:** Integrating LLMs into daily workflows.\n• **Data Decisioning:** AI-driven solutions for predictive analysis.\n• **Custom AI Solutions:** Building internal AI agents using enterprise data.\n\nWe've successfully trained leaders from Tata Steel and HDFC Bank in these cutting-edge domains.",
  
  fee: "Regenesys Corporate Education follows a **Performance-Based Pricing** model. We tailor costs based on the specific impact and scale required.\n\n**Primary Pricing Drivers:**\n• **Scale:** Number of participants (Volume discounts apply).\n• **Format:** Choice of On-site, Virtual, or Blended learning models.\n• **Customization:** Level of industry-specific module integration required.\n\nFor a detailed proposal including ROI projections, please contact our consulting wing at **+91 9773456788**.",
  
  esg: "The **ESG & Sustainability Programme** is designed for the C-Suite and Board members to navigate the evolving regulatory landscape.\n\n**Modules include:**\n• **Sustainability Reporting:** BRSR and global reporting standards.\n• **Impact Strategy:** Driving measurable environmental and social change.\n• **Governance Frameworks:** Compliance and ethical leadership in the 21st century.\n\nOur curriculum is updated quarterly to reflect latest SEBI and global ESG regulations.",
  
  leadership: "The **Leadership Mastery Suite** focuses on transforming high-potential employees into strategic leaders.\n\n**Flagship Modules:**\n• **Strategic Foresight:** Decision-making in volatile markets.\n• **Adaptive Communication:** Leading diverse and remote teams.\n• **Women in Leadership:** A specialized initiative that has already empowered 40+ leaders in major industrial sectors.\n\n*Success Insight:* Our partnership with Tata Steel led to a measurable increase in leadership competency scores across 3 business units.",
  
  data: "The **Data Zen Master** track is a deep-dive into the world of actionable intelligence.\n\n• **Stack:** Python, R, SQL, PowerBI, and Tableau.\n• **Hands-on Labs:** Solving real-world problems using your own (anonymized) enterprise data.\n• **Ethics & Governance:** Ensuring data privacy and security in analytics.\n\nIdeal for teams in BFSI and Manufacturing sectors where data-driven efficiency is critical.",
  
  about: "Regenesys Corporate Education has a **25+ year legacy** of transformative learning. We are a global institution known for academic excellence and industry relevance.\n\n**By the Numbers:**\n• **2,000+** Participants trained.\n• **100+** Enterprise batches completed.\n• **5,000+** Hours of high-impact training delivered.\n• **Top Clients:** Tata Steel, CRISIL, HDFC Bank, Bajaj Finserv, Hindalco.",

  success: "We have a strong track record of success across industries:\n\n• **Manufacturing:** Automated reporting workflows for Tata Steel.\n• **BFSI:** Enhanced data-driven decision making for HDFC Bank and Bajaj Finserv.\n• **Consulting:** Upskilled 100+ associates at CRISIL in advanced technology stacks.\n\nWould you like to see a case study for a specific sector?",

  hello: "Hello! I am your **Regenesys AI Assistant**. I have been indexed with our latest corporate documentations, programme brochures, and success stories.\n\nHow can I assist you with your corporate education or training needs today?"
};

export const getAIResponse = (query) => {
  const lower = query.toLowerCase();
  let text;
  let suggestions;

  // Greetings
  if (lower.match(/^(hi|hello|hey|greetings|morning|afternoon)/)) {
    text = knowledgeBase.hello;
    suggestions = ["What programmes do you offer?", "About Regenesys", "Success stories"];
  } 
  // Programmes
  else if (lower.includes('programme') || lower.includes('program') || lower.includes('course') || lower.includes('offer')) {
    text = knowledgeBase.programmes;
    suggestions = ["Gen AI Academy", "Data Zen Master", "Leadership Mastery"];
  } 
  // Enrolment
  else if (lower.includes('enrol') || lower.includes('enroll') || lower.includes('register') || lower.includes('join') || lower.includes('start')) {
    text = knowledgeBase.enrol;
    suggestions = ["What are the fees?", "Contact details", "About Regenesys"];
  } 
  // AI
  else if (lower.includes('gen ai') || lower.includes('artificial intelligence') || lower.includes('genai') || lower.includes('llm')) {
    text = knowledgeBase.ai;
    suggestions = ["Pricing for AI training", "Case studies in AI", "Prerequisites"];
  } 
  // Success / Clients
  else if (lower.includes('success') || lower.includes('client') || lower.includes('tata') || lower.includes('story') || lower.includes('track record')) {
    text = knowledgeBase.success;
    suggestions = ["Tata Steel case study", "Manufacturing sector", "BFSI success"];
  }
  // Fee
  else if (lower.includes('fee') || lower.includes('price') || lower.includes('cost') || lower.includes('pricing')) {
    text = knowledgeBase.fee;
    suggestions = ["Request a proposal", "Group discounts", "Enrolment process"];
  } 
  // ESG
  else if (lower.includes('esg') || lower.includes('sustainability') || lower.includes('environment')) {
    text = knowledgeBase.esg;
    suggestions = ["Certification details", "Module breakdown", "Who should attend?"];
  } 
  // Leadership
  else if (lower.includes('leader') || lower.includes('management') || lower.includes('executive')) {
    text = knowledgeBase.leadership;
    suggestions = ["Women in leadership", "Strategic modules", "Coaching options"];
  } 
  // Data
  else if (lower.includes('data') || lower.includes('analytics') || lower.includes('zen')) {
    text = knowledgeBase.data;
    suggestions = ["Tools used?", "Coding required?", "Data Governance"];
  } 
  // About
  else if (lower.includes('about') || lower.includes('regenesys') || lower.includes('company') || lower.includes('who')) {
    text = knowledgeBase.about;
    suggestions = ["Our success stories", "Training methodology", "Client list"];
  }
  // Default
  else {
    text = "I've searched through our internal knowledge base (including brochures and success stories). While I didn't find a direct match for that specific term, I can tell you about our **7 Flagship Programmes** or our **Corporate Consulting** services.\n\nWould you like to see a list of our training specializations?";
    suggestions = ["Show all programmes", "Contact a consultant", "About Regenesys"];
  }

  return { text, suggestions };
};

