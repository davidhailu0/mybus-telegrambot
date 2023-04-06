// const {Telegraf, Markup,Scenes} = require("telegraf")
// const cache = require("./utils/nodeCache")
// const {getDates} = require("./utils/dateTranslation")

// const bot = new Telegraf(process.env.BOT_TOKEN)

//Like express used for middleware
// bot.use((ctx,next)=>{
//     ctx.state.name = "Dawit"
//     ctx.reply("Hello")
//     next(ctx)
// })

// bot.start(ctx=>{
//     ctx.reply(`*Welcome to MyBus Ethiopia Telegram Bot* ${ctx.from.first_name}`)
//     ctx.reply('Enter Departure')
//     ctx.reply("Choose Language",{
//         reply_markup:{
//             inline_keyboard:[[{text:"አማርኛ",callback_data:"amh"},{text:"ትግርኛ",callback_data:"tgr"}],[{text:"Oromiffa",callback_data:"orm"},{text:"English",callback_data:"eng"}]]
//         }
//     })
// })

// bot.settings(ctx=>{
//     ctx.reply("This is the Setting")
// })

// bot.help(ctx=>{
//     ctx.reply("This is help ")
// })

// bot.on(message("da"), async (ctx) => {
//     console.log("Hello There")
//     // Explicit usage
//     await ctx.telegram.sendMessage(ctx.message.chat.id, `Hello ${ctx.state.role}`);
  
//     // Using context shortcut
//     await ctx.reply(`Hello ${ctx.state.role}`);
//   });

// bot.hears("hi",ctx=>ctx.reply("Hi"))

// bot.on("audio",ctx=>ctx.reply("You Sent Me an Audio"))

// bot.mention(["Ticket","Book"],ctx=>ctx.reply("This is amazing"))

// bot.phone("0777777777",ctx=>ctx.reply("active"))

// bot.action("amh",async(ctx)=>{
//     bot
// })

// bot.on('callback_query', async (ctx) => {
//     // Explicit usage
//     // await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);
  
//     // Using context shortcut
//     console.log()
//     await ctx.answerCbQuery();
//   });
  
//   bot.on('inline_query', async (ctx) => {
//     const result = [];
//     // Explicit usage
//     // await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);
  
//     // Using context shortcut
//     await ctx.answerInlineQuery(result);
//   });

// bot.action("tgr",ctx=>{
//     bot.telegram.sendMessage(ctx.chat.id,"በጃኹም ኣብ ሓደ ገዛ ኣቲኹም?",{})
// })

// bot.action("orm",ctx=>{
//     bot.telegram.sendMessage(ctx.chat.id,"Mee mana tokko galchaa?",{})
// })

// bot.action("eng",ctx=>{
//     bot.telegram.sendMessage(ctx.chat.id,"Enter Departure?",{})
// })

// const amh = new Scenes.WizardScene("amharic_conversation",
// ctx=>{
//     console.log(ctx);
//     ctx.reply("እባክዎን መነሻ ያስገቡ?")
//     return ctx.wizard.next();
// },
// ctx=>{
//     ctx.state.departure = ctx.message.text
//     ctx.reply("እባክዎን መዳረሻ ያስገቡ?")
//     return ctx.wizard.next();
// },
// ctx=>{
//     ctx.state.destination = ctx.message.text
//     const departureDates = getDates("amh")
//     const callbackBtns = []
//     for(let dpDate of departureDates){
//         callbackBtns.push(Markup.button.callback(dpDate.text,dpDate.data))
//     }
//     ctx.reply("የሚሄዱበትን ቀን ይምረጡ",Markup.inlineKeyboard(callbackBtns))
//     return ctx.scene.leave();
// }
// )

// const newStage = new Scenes.Stage([amh],{default:amh})

// bot.command('quit', async (ctx) => {
//     // Explicit usage
//     await ctx.telegram.leaveChat(ctx.message.chat.id);
  
//     // Using context shortcut
//     await ctx.leaveChat();
//   });


// bot.use(newStage.middleware())
// bot.launch()

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

// app.use(cors())

// app.listen(5000,()=>{
//     console.log("Listening on port 5000")
// })
const {Telegraf,session,Scenes} = require('telegraf')
require("dotenv").config()

// Handler factoriess
const { enter, leave } = Scenes.Stage
// Greeter scene
const greeterScene = new Scenes.BaseScene('greeter')
greeterScene.enter((ctx) => ctx.reply('Hi'))
greeterScene.leave((ctx) => ctx.reply('Bye'))
greeterScene.hears('hi', enter('greeter'))
greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))

// Echo scene
const echoScene = new Scenes.WizardScene('echo')
echoScene.enter((ctx) => ctx.reply('echo scene'))
echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
echoScene.command('back', leave())
echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))

const bot = new Telegraf(process.env.BOT_TOKEN)
const stage = new Scenes.Stage([greeterScene, echoScene], { ttl: 10 })
bot.use(session())
bot.use(stage.middleware())
bot.command('greeter', (ctx) => ctx.scene.enter('greeter'))
bot.command('echo', (ctx) => ctx.scene.enter('echo'))
bot.on('message', (ctx) => ctx.reply('Try /echo or /greeter'))
bot.launch()
