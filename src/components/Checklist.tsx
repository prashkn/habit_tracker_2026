import { useId, useState } from "react";
import { upsertHabitDay } from "../api";
import { getID } from "../utils/getID";

export type ChecklistItem = {
  id: string;
  label: string;
  checked: boolean;
};

export function Checklist({
  items,
  onToggle,
}: {
  items: ChecklistItem[];
  onToggle: (id: string, checked: boolean) => void;
}) {
  const groupId = useId();
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );

  async function saveChecklist() {
    try {
      setSaving("saving");
      await upsertHabitDay(getID(), items);
      setSaving("saved");
      window.setTimeout(() => setSaving("idle"), 1200);
    } catch (e) {
      console.error("saveChecklist failed", e);
      setSaving("error");
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
