const { Ollama } = require('ollama'); // 1. Import the Ollama class specifically

const ollama = new Ollama(); // 2. Create a new instance of the class

async function getAIEvaluation(studentTranslation, expertTranslation) {
  const prompt = `
    You are a helpful Latin and Italian professor. Evaluate the student's translation against the expert's version.
    Provide constructive feedback in Italian, in 2-3 sentences. Note one thing they did well and one area for improvement.
    
    Expert Translation: "${expertTranslation}"
    Student Translation: "${studentTranslation}"
    
    Your feedback (in Italian):
  `;

  try {
    // 3. Now, ollama.chat() will work correctly on the instance
    const response = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    });

    return response.message.content;

  } catch (error) {
    console.error("Error calling local Ollama model:", error);
    return "Non è stato possibile ottenere un feedback dall'IA in questo momento.";
  }
}

module.exports = { getAIEvaluation };