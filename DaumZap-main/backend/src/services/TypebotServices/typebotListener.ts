import axios from "axios";
import Ticket from "../../models/Ticket";
import QueueIntegrations from "../../models/QueueIntegrations";
import { WASocket, delay, proto } from "@whiskeysockets/baileys";
import { getBodyMessage } from "../WbotServices/wbotMessageListener";
import { isNil } from "lodash";
import UpdateTicketService from "../TicketServices/UpdateTicketService";


type Session = WASocket & {
    id?: number;
};

interface Request {
    wbot: Session;
    msg: proto.IWebMessageInfo;
    ticket: Ticket;
    typebot: QueueIntegrations;
}


async function handleTypebotError(ticket, companyId, errorMessage) {
    try {
        await UpdateTicketService({
            ticketData: {
                useIntegration: false,
                integrationId: null
            },
            ticketId: ticket.id,
            companyId: companyId
        });
        console.log(`Erro de sessão Typebot: ${errorMessage}`);
    } catch (error) {
        console.error("Erro ao atualizar o ticket:", error);
    }
}


const typebotListener = async ({
    wbot,
    msg,
    ticket,
    typebot
}: Request): Promise<void> => {

    if (msg.key.remoteJid === 'status@broadcast') return;

    const { urlN8N: url,
        typebotExpires,
        typebotKeywordFinish,
        typebotKeywordRestart,
        typebotUnknownMessage,
        typebotSlug,
        typebotDelayMessage,
        typebotRestartMessage
    } = typebot;

    const number = msg.key.remoteJid.replace(/\D/g, '');

    let body = getBodyMessage(msg);

    async function createSession(msg, typebot, number) {
        try {

            const reqData = JSON.stringify({
                "isStreamEnabled": true,
                "message": "string",
                "resultId": "string",
                "isOnlyRegistering": false,
                "prefilledVariables": {
                    "number": number,
                    "pushName": msg.pushName || ""
                },
            });

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${url}/api/v1/typebots/${typebotSlug}/startChat`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: reqData
            };

            const request = await axios.request(config);

            return request.data;

        } catch (error) {
            console.log("erro de sessão typbot");
            return;
        }
    }


    let sessionId
    let dataStart
    let status = false;
    try {
        const dataLimite = new Date()
        dataLimite.setMinutes(dataLimite.getMinutes() - Number(typebotExpires));

        if (typebotExpires > 0 && ticket.updatedAt < dataLimite) {
            console.log("sessão do typebot expirou");
            return; // Ignora o fluxo
        }

        if (isNil(ticket.typebotSessionId)) {            
            dataStart = await createSession(msg, typebot, number);
            sessionId = dataStart.sessionId
            status = true;
            await ticket.update({
                typebotSessionId: sessionId,
                typebotStatus: true,
                useIntegration: true,
                integrationId: typebot.id
            })
        } else {
            sessionId = ticket.typebotSessionId;
            status = ticket.typebotStatus;
        }

        if (!status) return;

        if (body !== typebotKeywordFinish && body !== typebotKeywordRestart) {
            let requestContinue
            let messages
            let input
            if (dataStart?.messages.length === 0 || dataStart === undefined) {
                const reqData = JSON.stringify({
                    "message": body
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: `${url}/api/v1/sessions/${sessionId}/continueChat`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    data: reqData
                };
                requestContinue = await axios.request(config);
                messages = requestContinue.data?.messages;
                input = requestContinue.data?.input;
            } else {
                messages = dataStart?.messages;
                input = dataStart?.input;
            }

            if (messages?.length === 0) {
                await wbot.sendMessage(`${number}@c.us`, { text: typebotUnknownMessage });
            } else {
                for (const message of messages) {
                    if (message.type === 'text') {
                        let formattedText = '';
                        let linkPreview = false;
                        for (const richText of message.content.richText) {
                            for (const element of richText.children) {
                                let text = '';

                                if (element.text) {
                                    text = element.text;
                                }
                                if (element.type && element.children) {
                                    for (const subelement of element.children) {
                                        let text = '';

                                        if (subelement.text) {
                                            text = subelement.text;
                                        }

                                        if (subelement.type && subelement.children) {
                                            for (const subelement2 of subelement.children) {
                                                let text = '';

                                                if (subelement2.text) {
                                                    text = subelement2.text;
                                                }

                                                if (subelement2.bold) {
                                                    text = `*${text}*`;
                                                }
                                                if (subelement2.italic) {
                                                    text = `_${text}_`;
                                                }
                                                if (subelement2.underline) {
                                                    text = `~${text}~`;
                                                }
                                                if (subelement2.url) {
                                                    const linkText = subelement2.children[0].text;
                                                    text = `[${linkText}](${subelement2.url})`;
                                                    linkPreview = true;
                                                }
                                                formattedText += text;
                                            }
                                        }
                                        if (subelement.bold) {
                                            text = `*${text}*`;
                                        }
                                        if (subelement.italic) {
                                            text = `_${text}_`;
                                        }
                                        if (subelement.underline) {
                                            text = `~${text}~`;
                                        }
                                        if (subelement.url) {
                                            const linkText = subelement.children[0].text;
                                            text = `[${linkText}](${subelement.url})`;
                                            linkPreview = true;
                                        }
                                        formattedText += text;
                                    }
                                }

                                if (element.bold) {
                                    text = `*${text}*`
                                }
                                if (element.italic) {
                                    text = `_${text}_`;
                                }
                                if (element.underline) {
                                    text = `~${text}~`;
                                }

                                if (element.url) {
                                    const linkText = element.children[0].text;
                                    text = `[${linkText}](${element.url})`;
                                    linkPreview = true;
                                }

                                formattedText += text;
                            }
                            formattedText += '\n';
                        }
                        formattedText = formattedText.replace('**', '').replace(/\n$/, '');

                        if (formattedText === "Invalid message. Please, try again.") {
                            formattedText = typebotUnknownMessage;
                        }

                        if (formattedText.startsWith("#")) {
                            let gatilho = formattedText.replace("#", "");

                            try {
                                let jsonGatilho = JSON.parse(gatilho);

                                if (jsonGatilho.stopBot  && isNil(jsonGatilho.userId)  && isNil(jsonGatilho.queueId)) {
                                    await ticket.update({
                                        useIntegration: false,
                                        isBot: false
                                    })

                                    return;
                                }
                                if (!isNil(jsonGatilho.queueId) && jsonGatilho.queueId > 0 && isNil(jsonGatilho.userId)) {
                                    await UpdateTicketService({
                                        ticketData: {
                                            queueId: jsonGatilho.queueId,
                                            chatbot: false,
                                            useIntegration: false,
                                            integrationId: null
                                        },
                                        ticketId: ticket.id,
                                        companyId: ticket.companyId
                                    })

                                    return;
                                }

                                if (!isNil(jsonGatilho.queueId) && jsonGatilho.queueId > 0 && !isNil(jsonGatilho.userId) && jsonGatilho.userId > 0) {
                                    await UpdateTicketService({
                                        ticketData: {
                                            queueId: jsonGatilho.queueId,
                                            userId: jsonGatilho.userId,
                                            chatbot: false,
                                            useIntegration: false,
                                            integrationId: null
                                        },
                                        ticketId: ticket.id,
                                        companyId: ticket.companyId
                                    })

                                    return;
                                }
                            } catch (err) {
                                throw err
                            }
                        }

                        await wbot.presenceSubscribe(msg.key.remoteJid)
                        //await delay(2000)
                        await wbot.sendPresenceUpdate('composing', msg.key.remoteJid)
                        await delay(typebotDelayMessage)
                        await wbot.sendPresenceUpdate('paused', msg.key.remoteJid)


                        await wbot.sendMessage(msg.key.remoteJid, { text: formattedText });
                    }

                    if (message.type === 'audio') {
                        await wbot.presenceSubscribe(msg.key.remoteJid)
                        //await delay(2000)
                        await wbot.sendPresenceUpdate('composing', msg.key.remoteJid)
                        await delay(typebotDelayMessage)
                        await wbot.sendPresenceUpdate('paused', msg.key.remoteJid)
                        const media = {
                            audio: {
                                url: message.content.url,
                                mimetype: 'audio/mp4',
                                ptt: true
                            },
                        }
                        await wbot.sendMessage(msg.key.remoteJid, media);

                    }

                    if (message.type === 'image') {
                        await wbot.presenceSubscribe(msg.key.remoteJid)
                        //await delay(2000)
                        await wbot.sendPresenceUpdate('composing', msg.key.remoteJid)
                        await delay(typebotDelayMessage)
                        await wbot.sendPresenceUpdate('paused', msg.key.remoteJid)
                        const media = {
                            image: {
                                url: message.content.url,
                            },

                        }
                        await wbot.sendMessage(msg.key.remoteJid, media);
                    }
                }
                if (input) {
                    if (input.type === 'choice input') {
                        let formattedText = '';
                        const items = input.items;
                        for (const item of items) {
                            formattedText += `▶️ ${item.content}\n`;
                        }
                        formattedText = formattedText.replace(/\n$/, '');
                        await wbot.presenceSubscribe(msg.key.remoteJid)
                        //await delay(2000)
                        await wbot.sendPresenceUpdate('composing', msg.key.remoteJid)
                        await delay(typebotDelayMessage)
                        await wbot.sendPresenceUpdate('paused', msg.key.remoteJid)
                        await wbot.sendMessage(msg.key.remoteJid, { text: formattedText });

                    }
                }
            }
        }
        if (body === typebotKeywordRestart) {
            await ticket.update({
                isBot: true,
                typebotSessionId: null

            })

            await ticket.reload();

            await wbot.sendMessage(`${number}@c.us`, { text: typebotRestartMessage })

        }
        if (body === typebotKeywordFinish) {
            await UpdateTicketService({
                ticketData: {
                    status: "closed",
                    useIntegration: false,
                    integrationId: null                   
                },
                ticketId: ticket.id,
                companyId: ticket.companyId
            })

            return;
        }
    } catch (error) {
        if (error.response) {
            // O servidor respondeu com um código de status fora do intervalo de 2xx
            await handleTypebotError(ticket, ticket.companyId, "Erro intervalo 2xx");
            console.log("Erro de sessão Typebot:", error.response.data);
        } else if (error.request) {
            // A solicitação foi feita, mas não houve resposta do servidor
            await handleTypebotError(ticket, ticket.companyId, "Sem resposta do servidor");
            console.log("Erro de sessão Typebot: Sem resposta do servidor");
        } else {
            // Ocorreu um erro durante a configuração da solicitação ou ao processar a resposta
            await handleTypebotError(ticket, ticket.companyId, "erro ao processar resposta");
            console.log("Erro de sessão Typebot:", error.message); 
        }
    }
}

export default typebotListener;