import CoinRender from "@/app/components/coin-render";
import { colors } from "@/app/components/coin-render/data";
import { Currency } from "@/app/lib/drizzle/schema";
import { cn } from "@heroui/react";
import NumberFlow from "@number-flow/react";
import { ChartArea } from "lucide-react";

interface PodiumProps {
  className: string;
  labelColor: string;
  labelBackground: string;
  label: string;
  currency?: Currency;
}

function Podium(props: PodiumProps) {
  const { className, label, labelColor, labelBackground, currency } = props;
  return (
    <div
      className={cn(
        "w-full rounded-2xl bg-default-50 flex flex-col justify-between border-4 overflow-hidden",
        className
      )}
      style={{ borderColor: labelBackground }}
    >
      {currency && (
        <div className="w-full h-fit flex flex-col items-center bg-black/40 py-3">
          <CoinRender
            color={currency.styles[0]}
            format={currency.styles[1]}
            symbol={currency.styles[2]}
          />
          <span style={{ color: colors[currency.styles[0]][2] }}>
            {currency.name}
          </span>
        </div>
      )}

      <div
        className="w-full py-1 flex justify-center items-center h-full"
        style={{ background: labelBackground }}
      >
        <span className="font-black text-2xl" style={{ color: labelColor }}>
          {label}
        </span>
      </div>

      <div className="w-full h-fit p-2 flex flex-col bg-green-500/20 text-green-500 items-center">
        <div className="flex gap-2 items-center justify-center text-xl font-black">
          {currency && <NumberFlow value={currency?.score} />}
          <ChartArea />
        </div>
        <span className="text-sm">Pontuação</span>
      </div>
    </div>
  );
}

export default Podium;
