import { NichoData } from "@/types/partner";

export const nichos: Record<string, NichoData> = {
  "viajante-solo": {
    titulo: "Por que quem viaja sozinha escolhe o El Misti",
    beneficios: [
      { icon: "shield", titulo: "Seguranca 24h", desc: "Recepcao e cameras o tempo todo" },
      { icon: "users", titulo: "Comunidade acolhedora", desc: "Conheca pessoas de todo o mundo" },
      { icon: "globe", titulo: "Staff multilingual", desc: "Equipe que fala ingles, espanhol e portugues" },
    ],
  },
  mochileiro: {
    titulo: "Por que mochileiros voltam pro El Misti",
    beneficios: [
      { icon: "dollar", titulo: "Melhor custo-beneficio", desc: "Cafe da manha e wifi inclusos" },
      { icon: "star", titulo: "Experiencias gratis", desc: "Passeios e eventos toda semana" },
      { icon: "map", titulo: "40 seg da praia", desc: "Localizacao privilegiada em Ipanema" },
    ],
  },
  surfista: {
    titulo: "Por que surfistas ficam no El Misti",
    beneficios: [
      { icon: "board", titulo: "Guarda-pranchas", desc: "Espaco seguro para seu equipamento" },
      { icon: "wave", titulo: "Ipanema a 40 seg", desc: "Acorde e va direto pro mar" },
      { icon: "users", titulo: "Galera do surf", desc: "Comunidade de surfistas hospedes" },
    ],
  },
  nomad: {
    titulo: "Por que nomades digitais produzem no El Misti",
    beneficios: [
      { icon: "wifi", titulo: "WiFi forte", desc: "Conexao estavel para trabalho remoto" },
      { icon: "laptop", titulo: "Espacos de trabalho", desc: "Areas comuns com tomadas e mesas" },
      { icon: "coffee", titulo: "Networking", desc: "Conheca outros nomades e empreendedores" },
    ],
  },
  casal: {
    titulo: "Por que casais escolhem o El Misti",
    beneficios: [
      { icon: "bed", titulo: "Quartos privativos", desc: "Privacidade com preco de hostel" },
      { icon: "heart", titulo: "Localizacao romantica", desc: "Ipanema e seus pores do sol" },
      { icon: "dollar", titulo: "Metade do preco de hotel", desc: "Economize para curtir mais" },
    ],
  },
};
