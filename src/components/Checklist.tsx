import { useEffect, useId, useState } from "react";
import { upsertHabitDay } from "../api";
import { getID } from "../utils/getID";

export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

export function Checklist({
  items,
  initNote,
  onToggle,
}: {
  items: ChecklistItem[];
  initNote?: string;
  onToggle: (id: string, checked: boolean) => void;
}) {
  const [note, setNote] = useState<string>(initNote ?? "");
  const groupId = useId();
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  useEffect(() => {
    setNote(initNote ?? "");
  }, [initNote]);

  async function saveChecklist() {
    try {
      setSaving("saving");
      await upsertHabitDay(getID(), items, note);
      setSaving("saved");
      window.setTimeout(() => setSaving("idle"), 1200);
      alert("Saved successfully");
    } catch (e) {
      console.error("saveChecklist failed", e);
      setSaving("error");
      alert("Failed to save");
    }
  }

  return (
    <div className="checklist" role="group" aria-label="Checklist">
      {items.map((item) => {
        const inputId = `${groupId}-${item.id}`;

        return (
          <label key={item.id} className="checklistRow" htmlFor={inputId}>
            <input
              id={inputId}
              className="checkbox"
              type="checkbox"
              checked={item.checked}
              onChange={(e) => onToggle(item.id, e.target.checked)}
            />
            <span className="checklistLabel">{item.label}</span>
          </label>
        );
      })}

      <textarea
        className="note"
        placeholder="add an optional note..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <button
        className="saveButton"
        type="button"
        onClick={saveChecklist}
        disabled={saving === "saving"}
      >
        Save
      </button>
    </div>
  );
}
