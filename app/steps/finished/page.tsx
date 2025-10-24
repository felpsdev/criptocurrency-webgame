import CoinRender from "@/app/components/coin-render";
import { colors } from "@/app/components/coin-render/data";
import QuizChart, { Answer } from "@/app/components/quiz-chart";
import { db } from "@/app/lib/drizzle";
import { currencies } from "@/app/lib/drizzle/schema";
import { getSession } from "@/app/lib/session";
import { eq } from "drizzle-orm";
import { ChartArea } from "lucide-react";
import { redirect } from "next/navigation";

async function Page() {
  const session = await getSession();
  if (!session || session.currencyId === null) {
    redirect("/");
  }

  const currency = await db
    .select()
    .from(currencies)
    .where(eq(currencies.id, session.currencyId));
  if (!currency) {
    redirect("/");
  }

  const [color, format, symbol] = currency[0].styles as number[];

  return (
    <div className="w-full h-fit flex flex-col p-0 bg-default-50 rounded-xl border-1 border-default-100 overflow-hidden">
      <div className="w-full bg-background/50 py-2 relative overflow-hidden">
        <div className="flex flex-col items-center z-3 relative">
          <CoinRender color={color} format={format} symbol={symbol} />
          <span style={{ color: colors[color][2] }}>{currency[0].name}</span>
        </div>
        <div className="absolute left-0 top-0 w-full h-full z-0 opacity-35">
          <QuizChart answers={session.answers as Answer[]} />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-5">
        <span>
          Párabens! Sua moeda foi finalizada com sucesso. Fique de olho no
          ranking para ver sua posição! Confira a pontuação atingida abaixo.
        </span>
        <div className="w-full h-fit p-2 gap-2 flex items-center justify-center text-xl bg-green-500/20 text-green-500 rounded-lg font-black">
          {currency[0].score}
          <ChartArea />
        </div>
      </div>
    </div>
  );
}

export default Page;
