import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useMemo } from "react";

interface LineSelectionValue {
  label: string;
  value: number;
}

interface LineSelectionProps {
  label: string;
  data: LineSelectionValue[];
  selected: number;
  onChange: (value: number) => void;
}

function LineSelection(props: LineSelectionProps) {
  const { label, data, selected, onChange } = props;
  const selectedData = useMemo(
    () => data.find((r) => r.value === selected),
    [selected, data]
  );

  const handleProcessChange = useCallback(
    (target: number) => {
      if (!selectedData) return;

      const selectedIndex = data.indexOf(selectedData);
      let next = -1;

      if (target === 1) {
        if (selectedIndex === data.length - 1) {
          next = 0;
        } else {
          next = selectedIndex + 1;
        }
      } else if (target === -1) {
        if (selectedIndex === 0) {
          next = data.length - 1;
        } else {
          next = selectedIndex - 1;
        }
      }

      onChange(data[next].value);
    },
    [selectedData]
  );

  return (
    <div className="w-full h-fit rounded-xl bg-default-100 p-3 gap-3 flex flex-col">
      <span className="text-sm text-default-500">{label}</span>
      <div className="flex w-full justify-between items-center gap-3">
        <Button
          onPress={() => handleProcessChange(-1)}
          isIconOnly
          className="text-default-500"
        >
          <ChevronLeft />
        </Button>
        <span className="text-sm w-full h-10 rounded-lg flex items-center justify-center bg-default-200">
          {selectedData?.label}
        </span>
        <Button
          onPress={() => handleProcessChange(1)}
          isIconOnly
          className="text-default-500"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}

export default LineSelection;
