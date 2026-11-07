import { storeConfig } from "@/data/config";
import { formatHour } from "@/lib/hours";

export function Footer() {
  const { schedule, closedNote } = storeConfig.hours;
  const { address, instagram } = storeConfig;

  return (
    <footer className="mx-auto mt-10 max-w-2xl px-4">
      <div className="rounded-3xl bg-brand-secondary/5 p-5 text-sm">
        {schedule.length > 0 && (
          <>
            <h2 className="mb-3 font-extrabold text-brand-primary">
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
              {closedNote && (
                <li className="font-semibold text-brand-secondary">
                  {closedNote}
                </li>
              )}
            </ul>
          </>
        )}

        {address && (
          <p className="mt-4 flex gap-2 text-gray-600">
            <span aria-hidden="true">📍</span>
            <span>{address}</span>
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={`https://wa.me/${storeConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold text-brand-primary"
          >
            <span aria-hidden="true">📞</span>
            {storeConfig.phoneDisplay}
          </a>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-bold text-brand-primary"
            >
              <span aria-hidden="true">📷</span>
              Instagram
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
