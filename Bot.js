const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

// Replace 'YOUR_BOT_TOKEN' with your actual bot token from Telegram
const bot = new Telegraf('7132320562:AAHG8DpwWVeTsRZcdrbsX515W-Ajtsn9KNE');

// Helper function to shorten URLs using TinyURL
const shortenUrl = async (url) => {
  try {
    const response = await axios.get(`http://tinyurl.com/api-create.php?url=${url}`);
    return response.data;
  } catch (error) {
    console.error('Error shortening URL:', error);
    return url; // Return original URL in case of failure
  }
};

bot.on('text', async (ctx) => {
  const message = ctx.message.text;
  const chatId = ctx.chat.id;

  // Inform user the bot is processing the request
  await ctx.sendChatAction('typing');

  const url = `https://teraboxvideodownloader.nepcoderdevs.workers.dev/?url=${message}`;

  try {
    const response = await axios.get(url);

    if (response.status === 200) {
      const data = response.data;

      const resolutions = data.response[0].resolutions;
      const fastDownloadLink = resolutions['Fast Download'];
      const hdVideoLink = resolutions['HD Video'];
      const thumbnailUrl = data.response[0].thumbnail;
      const videoTitle = data.response[0].title;

      // Shorten both download links
      const shortenedFastDownloadLink = await shortenUrl(fastDownloadLink);
      const shortenedHdVideoLink = await shortenUrl(hdVideoLink);

      // Create inline keyboard with the shortened URLs
      const markup = Markup.inlineKeyboard([
        [
          Markup.button.url('➡️ Fast Download', shortenedFastDownloadLink),
          Markup.button.url('▶️ HD Video', shortenedHdVideoLink)
        ],
        [
          Markup.button.url('Developer', 't.me/Privates_Bots')
        ]
      ]);

      const messageText = `🎬 <b>Title:</b> ${videoTitle}\nMade with ❤️ by @Privates_Bots`;

      // Send the video details and thumbnail to the user
      await ctx.replyWithPhoto(thumbnailUrl, {
        caption: messageText,
        parse_mode: 'HTML',
        reply_markup: markup
      });
    } else {
      await ctx.reply('❌ <b>Error fetching data from Terabox API</b>', { parse_mode: 'HTML' });
    }
  } catch (error) {
    console.error('Error:', error);
    await ctx.reply(`❌ <b>Error: ${error.message}</b>`, { parse_mode: 'HTML' });
  }
});

// Start the bot
bot.launch();
        
