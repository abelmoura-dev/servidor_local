import { proto, WASocket } from "@whiskeysockets/baileys";
import Contact from "../../models/Contact";
import Setting from "../../models/Setting";
import Ticket from "../../models/Ticket";
import { getBodyMessage, sleep } from "./wbotMessageListener";
import formatBody from "../../helpers/Mustache";
import axios from 'axios';


export const provider = async (ticket: Ticket, msg: proto.IWebMessageInfo, companyId: number, contact: Contact, wbot: WASocket) => {

  const filaescolhida = ticket.queue?.name;

  if (filaescolhida === "2ª via de boleto" || filaescolhida === "2 via de boleto") {
    const ErroTotal = {
      text: formatBody(`Algo deu errado, por favor aguarde enquanto encaminho o atendimento para um atendente...`, contact)
    };
  
    const ipmkauth = await Setting.findOne({
      where: {
        key: "ipmkauth",
        companyId
      }
    });
  
    const clientidmkauth = await Setting.findOne({
      where: {
        key: "clientidmkauth",
        companyId
      }
    });
  
    const clientesecretmkauth = await Setting.findOne({
      where: {
        key: "clientsecretmkauth",
        companyId
      }
    });
  
    let urlmkauth = ipmkauth.value;
    if (urlmkauth.substr(-1) === '/') {
      urlmkauth = urlmkauth.slice(0, -1);
    }

    let cpfcnpj = getBodyMessage(msg).replace(/[^0-9]/g, ''); // Remoção de caracteres especiais

    if (!isNaN(parseInt(cpfcnpj)) && (cpfcnpj.length === 11 || cpfcnpj.length === 14)) {
    let url = `${urlmkauth}/api/`;
    const Client_Id = clientidmkauth.value;
    const Client_Secret = clientesecretmkauth.value;

    try {
      // Requisição para obter o JWT
      const { data: jwt } = await axios.get(`${url}`, {
        auth: {
          username: `${Client_Id}`,
          password: `${Client_Secret}`
        }
      });

      // Requisição para obter os dados de titulo vencidos
      const { data: vencidos } = await axios.get(`${url}/titulo/vencido/${cpfcnpj}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      console.log(vencidos);

      // Requisição para obter os dados de titulos em aberto
      const { data } = await axios.get(`${url}/titulo/aberto/${cpfcnpj}`, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      console.log(data.titulos[0]);

      if (!("mensagem" in vencidos) || vencidos.mensagem !== "Registro não encontrado") {

        for (const titulo of vencidos.titulos) {
          const datavencimento = new Date(titulo.datavenc);
          const vencimento = `${datavencimento.getDate()}/${datavencimento.getMonth() + 1}/${datavencimento.getFullYear()}`;
          
          const textMessage = {
              text: formatBody(`*Parcela em atraso:*\n\n*Título:* ${titulo.titulo}\n*CPF/CNPJ:* ${titulo.cpf_cnpj}\n*Valor:* R$ ${titulo.valor}\n*Vencimento:* ${vencimento}\n\nVocê pode pagar utilizando uma das opções abaixo.\n\nCódigo de barras:`, contact)
          };

          const barras = {
            text: formatBody(`${titulo.linhadig}`, contact)
          };
  
          const textMessagePix = {
              text: formatBody(`*Pix copiar e colar:*`, contact)
          };

          const pix = {
            text: formatBody(`${titulo.pix}`, contact)
          };
  
          await sleep(3000);
          await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
          await sleep(3000);
          await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, barras);
          await sleep(3000);
          await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessagePix);
          await sleep(3000);
          await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, pix);
      }
      }

      if(!("mensagem" in data) || data.mensagem !== "Registro não encontrado"){
        // Armazenamento dos dados em variáveis
        const primeiroTitulo = data.titulos[0];
        // Armazenamento dos dados em variáveis
        const { titulo, datavenc, valor, linhadig, pix, cpf_cnpj } = primeiroTitulo;
        // Convertendo a data de vencimento para o formato DD/MM/AAAA
        const datavencimento = new Date(datavenc);
        const dia = ('0' + datavencimento.getDate()).slice(-2);
        const mes = ('0' + (datavencimento.getMonth() + 1)).slice(-2);
        const ano = datavencimento.getFullYear();
        const vencimento = `${dia}/${mes}/${ano}`;

        // Organização dos dados em um texto
        const textMessage = {
          text: formatBody(`*Parcela em aberto:*\n\n*Titulo:* ${titulo}\n*CPF / CNPJ:* ${cpf_cnpj}\n*Vencimento:* ${vencimento}\n*Valor:* R$ ${valor}\n\nVocê pode pagar utilizando uma das opções abaixo.\n\nCódigo de barras:`, contact)
        };

        const textMessageBarras = {
          text: formatBody(`${linhadig}`, contact)
        };
        
        const textMessagePix = {
          text: formatBody(`*Pix copia e cola:*`, contact)
        };

        const textMessagePixCode = {
          text: formatBody(`${pix}`, contact)
        };

        // Envio da mensagem com os dados organizados
        await sleep(3000);
        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessage);
        await sleep(3000);
        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessageBarras);
        await sleep(3000);
        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessagePix);
        await sleep(3000);
        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, textMessagePixCode);
      }

      }catch{

        await sleep(3000);

        await wbot.sendMessage(`${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`, ErroTotal);

      }
}else{
  console.log("descarte");
  await ticket.update({ 
    status: "open"
  });
}}
};