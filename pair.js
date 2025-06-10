const { makeid } = require('./gen-id'); const express = require('express'); const fs = require('fs'); let router = express.Router(); const pino = require("pino"); const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys')

const { upload } = require('./mega'); function removeFile(FilePath) { if (!fs.existsSync(FilePath)) return false; fs.rmSync(FilePath, { recursive: true, force: true }); }

router.get('/', async (req, res) => { const id = makeid(); let num = req.query.number; async function PEACE_MD_PAIR_CODE() { const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id); try { const browserChoice = ["Safari"]; const browser = browserChoice[Math.floor(Math.random() * browserChoice.length)];

let sock = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            printQRInTerminal: false,
            generateHighQualityLinkPreview: true,
            logger: pino({ level: "fatal" }).child({ level: "fatal" }),
            syncFullHistory: false,
            browser: Browsers.macOS(browser)
        });

        if (!sock.authState.creds.registered) {
            await delay(1500);
            num = num.replace(/[^0-9]/g, '');
            const code = await sock.requestPairingCode(num);
            if (!res.headersSent) {
                await res.send({ code });
            }
        }

        sock.ev.on('creds.update', saveCreds);
        sock.ev.on("connection.update", async (s) => {
            const { connection, lastDisconnect } = s;

            if (connection == "open") {
                await delay(5000);
                let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                let rf = __dirname + `/temp/${id}/creds.json`;

                function generateRandomText() {
                    const prefix = "3EB";
                    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                    let randomText = prefix;
                    for (let i = prefix.length; i < 22; i++) {
                        const randomIndex = Math.floor(Math.random() * characters.length);
                        randomText += characters.charAt(randomIndex);
                    }
                    return randomText;
                }

                const randomText = generateRandomText();
                try {
                    const mega_url = await upload(fs.createReadStream(rf), `${sock.user.id}.json`);
                    const string_session = mega_url.replace('https://mega.nz/file/', '');
                    let md = "PEACE~" + string_session;

                    let code = await sock.sendMessage(sock.user.id, { text: md });

                    let desc = `*👋🏻 WELCOME TO PEACE MD !*\n\n` +
                               `╭─────────────────────\n` +
                               `┃ ✅ *Connected Successfully!*\n` +
                               `┃ 📱 *Device:* PEACE-MD Bot\n` +
                               `╰─────────────────────\n` +
                               `╭─────────────────────\n` +
                               `┃ 🌐 *Subscribe to Channel:*\n` +
                               `┃ https://whatsapp.com/channel/0029VbA9YD323n3ko5xL7J1e\n` +
                               `╰─────────────────────\n` +
                               `╭─────────────────────\n` +
                               `┃ 🧠 *Repo:*\n` +
                               `┃ https://github.com/Peacemaker-cyber/PEACE-MD\n` +
                               `╰─────────────────────\n` +
                               `╭─────────────────────\n` +
                               `┃ 🤖 *Powered by PEACEMAKER *\n` +
                               `╰─────────────────────`;

                    await sock.sendMessage(sock.user.id, {
                        text: desc,
                        contextInfo: {
                            externalAdReply: {
                                title: "PEACE MULTI DEVICE",
                                thumbnailUrl: "https://files.catbox.moe/n0dgjr.jpg",
                                sourceUrl: "https://whatsapp.com/channel/0029VbA9YD323n3ko5xL7J1e",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    }, { quoted: code });

                    // Send message to channel JID
                    await sock.sendMessage("120363421564278292@newsletter", {
                        text: "🔔 PEACE MD bot has connected successfully."
                    });

                } catch (e) {
                    let ddd = sock.sendMessage(sock.user.id, { text: e.toString() });
                    await sock.sendMessage(sock.user.id, { text: `*Error occurred while sending PEACE-MD session.*` }, { quoted: ddd });
                }

                await delay(10);
                await sock.ws.close();
                await removeFile('./temp/' + id);
                console.log(`👤 ${sock.user.id} connected. Restarting...`);
                await delay(10);
                process.exit();
            } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                await delay(10);
                PEACE_MD_PAIR_CODE();
            }
        });
    } catch (err) {
        console.log("service restarted");
        await removeFile('./temp/' + id);
        if (!res.headersSent) {
            await res.send({ code: "❗ Service Unavailable" });
        }
    }
}
return await PEACE_MD_PAIR_CODE();

});

module.exports = router;

