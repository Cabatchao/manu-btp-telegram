const axios = require('axios');
module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { message } = req.body;
    if (message && message.text) {
      const prompt = `Tu es Manu, assistant BTP en Polynésie. Tu réponds en XPF, utilise "Ia ora na". Tarifs : Dalle 40x40=1500, Dalle 50x50=2200. TVA 5%. Calcule les devis en JSON si demandé.`;
      try {
        const aiRes = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
          model: "llama3-8b-8192",
          messages: [{role: "system", content: prompt}, {role: "user", content: message.text}]
        }, { headers: { 'Authorization': `Bearer ${process.env.GROQ_KEY}` } });
        
        await axios.post(`https://api.telegram.org/bot${process.env.TELE_TOKEN}/sendMessage`, {
          chat_id: message.chat.id, text: aiRes.data.choices[0].message.content
        });
      } catch (e) { console.log(e) }
    }
  }
  res.status(200).send('OK');
};
