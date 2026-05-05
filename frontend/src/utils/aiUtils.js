import api from '../api';

export const getAIResponse = async (query, sessionId = null) => {
  try {
    const payload = {
      question: query,
    };
    if (sessionId) {
      payload.session_id = sessionId;
    }

    const response = await api.post('/chat/ask', payload);
    const data = response.data;

    return {
      text: data.answer,
      suggestions: [], // You can generate suggestions based on the answer if you like
      sessionId: data.session_id, // Ensure frontend saves this
      citations: data.citations,
      sources: data.sources
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      text: "I am currently unable to connect to the server. Please try again later.",
      suggestions: ["Try again"]
    };
  }
};

