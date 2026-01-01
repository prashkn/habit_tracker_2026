import { useCallback, useEffect, useState } from "react";
import { Checklist } from "./components/Checklist";
import { fetchHabitDay, type HabitDayRow } from "./api";
import { getID } from "./utils";

function formatLocalDateTime(d: Date) {
  return d.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const now = new Date();

export function App() {
  const [items, setItems] = useState(() => [
    { id: "weight_lifting", label: "Gym", checked: false },
    { id: "cardio", label: "Cardio", checked: false },
    { id: "boxing", label: "Boxing", checked: false },
    { id: "table_tennis", label: "Table Tennis", checked: false },
    { id: "read", label: "Read", checked: false },
    { id: "wrote", label: "Wrote", checked: false },
    { id: "code", label: "Coded outside of work", checked: false },
    { id: "vacation", label: "Vacation", checked: false },
    { id: "alcohol", label: "Drank", checked: false },
    { id: "party", label: "Party/Planned Event", checked: false },
    { id: "cry", label: "Cried", checked: false },
  ]);
  const [initNote, setInitNote] = useState<string>("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const dayId = getID();
        const row = await fetchHabitDay(dayId);
        if (cancelled) return;

        setItems((prev) => hydrateChecksFromRow(prev, row));
        setInitNote(noteFromRow(row));
      } catch (e) {
        console.error("Failed to load habits row for today", e);
        // Default to false if we can't load.
        if (!cancelled) {
          setItems((prev) => prev.map((it) => ({ ...it, checked: false })));
          setInitNote("");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const onToggle = useCallback((id: string, checked: boolean) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked } : it))
    );
  }, []);

  return (
    <div className="page">
      <div className="content">
        <h1 className="title">{formatLocalDateTime(now)}</h1>
        <Checklist initNote={initNote} items={items} onToggle={onToggle} />
      </div>
    </div>
  );
}

function hydrateChecksFromRow(
  items: Array<{ id: string; label: string; checked: boolean }>,
  row: HabitDayRow | null
) {
  if (!row) return items.map((it) => ({ ...it, checked: false }));

  return items.map((it) => {
    const v = row[it.id];
    return { ...it, checked: typeof v === "boolean" ? v : false };
  });
}

function noteFromRow(row: HabitDayRow | null): string {
  if (!row) return "";
  const v = row.note;
  return typeof v === "string" ? v : "";
}
