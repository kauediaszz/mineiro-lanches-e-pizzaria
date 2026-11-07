import { storeConfig } from "@/data/config";

const DAY_NAMES = [
  "domingo",
  "segunda",
  "terça",
  "quarta",
  "quinta",
  "sexta",
  "sábado",
];

const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** "19:00" -> "19h", "01:30" -> "1h30" */
export function formatHour(time: string): string {
  const [h, m] = time.split(":").map(Number);
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

/** Dia da semana e minutos do dia no horário de Brasília, independente do aparelho. */
function getBrazilClock(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";

  return {
    day: WEEKDAY_INDEX[get("weekday")] ?? 0,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

const { schedule } = storeConfig.hours;

function slotFor(day: number) {
  return schedule.find((s) => s.days.includes(day));
}

export interface OpenStatus {
  isOpen: boolean;
  text: string;
}

export function getOpenStatus(date: Date = new Date()): OpenStatus {
  // Loja sem horário cadastrado: não mostramos aberto/fechado
  if (schedule.length === 0) return { isOpen: false, text: "" };

  const { day, minutes } = getBrazilClock(date);

  // Ainda dentro do expediente de ontem (ex: sábado 19h às 2h, agora é domingo 00h30)
  const yesterday = slotFor((day + 6) % 7);
  if (
    yesterday &&
    toMinutes(yesterday.close) < toMinutes(yesterday.open) &&
    minutes < toMinutes(yesterday.close)
  ) {
    return {
      isOpen: true,
      text: `Aberto agora · até ${formatHour(yesterday.close)}`,
    };
  }

  const today = slotFor(day);

  if (today) {
    const open = toMinutes(today.open);
    const close = toMinutes(today.close);
    const crossesMidnight = close < open;

    if (minutes >= open && (crossesMidnight || minutes < close)) {
      return {
        isOpen: true,
        text: `Aberto agora · até ${formatHour(today.close)}`,
      };
    }
    if (minutes < open) {
      return {
        isOpen: false,
        text: `Fechado · abre hoje às ${formatHour(today.open)}`,
      };
    }
  }

  // Procura o próximo dia com expediente
  const prefix = today ? "Fechado" : "Folga hoje";
  for (let offset = 1; offset <= 7; offset++) {
    const nextDay = (day + offset) % 7;
    const next = slotFor(nextDay);
    if (next) {
      const when = offset === 1 ? "amanhã" : DAY_NAMES[nextDay];
      return {
        isOpen: false,
        text: `${prefix} · abre ${when} às ${formatHour(next.open)}`,
      };
    }
  }

  return { isOpen: false, text: "Fechado" };
}
