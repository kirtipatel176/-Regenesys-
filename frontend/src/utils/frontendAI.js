import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Fallback AI response using the frontend SDK directly.
 * Useful if the backend RAG pipeline fails or doesn't find context.
 */
export const getFrontendAIResponse = async (query, documents = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare content for Gemini
    const parts = [
      { text: "You are a helpful AI assistant. Answer the user's question ONLY using the provided document context below. If you cannot find the answer in the documents, state that clearly." }
    ];

    // Add document data
    for (const doc of documents) {
      if (doc.base64 && (doc.mimeType === "application/pdf")) {
        parts.push({
          inlineData: {
            data: doc.base64,
            mimeType: doc.mimeType
          }
        });
      }
      
      // Always include text content if available as backup
      if (doc.textContent) {
        parts.push({ text: `Document Name: ${doc.name}\nContent:\n${doc.textContent}` });
      }
    }

    // Add the user's actual question at the end
    parts.push({ text: `User Question: ${query}` });

    const result = await model.generateContent({
        contents: [{ role: "user", parts: parts }]
    });
    
    const response = await result.response;
    const text = response.text();

    return {
      text: text,
      sources: documents.map(d => d.name),
      isFrontend: true
    };
  } catch (error) {
    console.error("Frontend AI Error:", error);
    throw error;
  }
};

/**
 * Helper to convert file to base64
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the prefix (e.g. "data:application/pdf;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Helper to read file as text
 */
export const fileToText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
