import api from '../api';

export const getAIResponse = async (question, sessionId = null) => {
  try {
    const response = await api.post('/chat/ask', {
      question,
      session_id: sessionId
    });
    return {
      text: response.data.answer,
      sources: response.data.sources || [],
      session_id: response.data.session_id
    };
  } catch (error) {
    console.error("Backend AI Error:", error);
    return {
      text: "I'm sorry, I'm having trouble connecting to the server right now.",
      sources: []
    };
  }
};
