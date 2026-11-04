import { storeConfig } from "@/data/config";
import { formatHour } from "@/lib/hours";

export function Footer() {
  const { schedule, closedNote } = storeConfig.hours;

  return (
    <footer className="mx-auto mt-10 max-w-2xl px-4">
      <div className="rounded-3xl bg-brand-pink/5 p-5 text-sm">
        <h2 className="mb-3 font-extrabold text-brand-violet">
          Horário de funcionamento
        </h2>
        <ul className="space-y-1.5 text-gray-600">
          {schedule.map((slot) => (
            <li key={slot.label} className="flex justify-between gap-3">
              <span className="font-semibold">{slot.label}</span>
              <span>
                {formatHour(slot.open)} às {formatHour(slot.close)}
              </span>
            </li>
          ))}
          <li className="font-semibold text-brand-pink">{closedNote}</li>
        </ul>

        <a
          href={`https://wa.me/${storeConfig.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 font-bold text-brand-violet"
        >
          <span aria-hidden="true">📞</span>
          {storeConfig.phoneDisplay}
        </a>
      </div>
    </footer>
  );
}
