import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

/**
 * Fallback AI response using the frontend SDK directly.
 * Useful if the backend RAG pipeline fails or doesn't find context.
 */
export const getFrontendAIResponse = async (query, documents = []) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepare content for Gemini (Query + Document Data)
    const contents = [
      {
        text: `Based strictly on the provided documents, answer this question: ${query}. If the documents don't contain the answer, say so.`
      }
    ];

    // Add document data as inline parts
    for (const doc of documents) {
      if (doc.base64) {
        contents.push({
          inlineData: {
            data: doc.base64,
            mimeType: doc.mimeType || "application/pdf"
          }
        });
      } else if (doc.textContent) {
        contents.push({ text: `Document content (${doc.name}):\n${doc.textContent}` });
      }
    }

    const result = await model.generateContent({
        contents: [{ role: "user", parts: contents }]
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

export async function generateQuiz(docContents, difficulty = 'Medium') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Based on the following document content, generate a ${difficulty} difficulty quiz.
      Provide 5 Multiple Choice Questions (MCQs).
      Return the response strictly as a JSON array of objects.
      Each object must have:
      - question: The question text
      - options: An array of 4 strings
      - correctAnswer: The exact string from the options that is correct
      - explanation: A brief explanation why it's correct

      Document Content:
      ${docContents.map(d => d.content).join("\n\n").slice(0, 10000)}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Clean JSON from markdown if necessary
    const jsonStr = text.match(/\[.*\]/s)?.[0] || text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Quiz Generation Error:", error);
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
