"use client";

import CoinRender from "@/app/components/coin-render";
import { colors } from "@/app/components/coin-render/data";
import { Currency } from "@/app/lib/drizzle/schema";
import { createClient } from "@/app/lib/supabase";
import NumberFlow from "@number-flow/react";
import { ChartArea } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import tailcolors from "tailwindcss/colors";
import Podium from "./podium";

interface ViewProps {
  initialData: Currency[];
}

const client = createClient();

function View(props: ViewProps) {
  const { initialData } = props;

  const [currencies, setCurrencies] = useState(initialData);
  const commonCurrencies = useMemo(
    () => currencies.filter((_, i) => i > 2),
    [currencies]
  );
  const dateOrderedCurrencies = useMemo(
    () =>
      [...currencies].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [currencies]
  );

  useEffect(() => {
    const channel = client
      .channel("rank-listener")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "currencies" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const { id, name, score, styles, created_at, created_by } =
              payload.new;
            const newState = [
              {
                id,
                name,
                score,
                styles,
                createdAt: created_at,
                createdBy: created_by,
              },
              ...currencies,
            ];
            newState.sort((a, b) => b.score - a.score);
            setCurrencies([...newState]);
          }

          if (payload.eventType === "UPDATE") {
            const { id, name, score, styles, created_at, created_by } =
              payload.new;
            const old = currencies.find((c) => c.id === id);
            if (!old) return;

            const newState = [...currencies];
            newState.splice(currencies.indexOf(old), 1, {
              id,
              name,
              score,
              styles,
              createdAt: created_at,
              createdBy: created_by,
            });
            newState.sort((a, b) => b.score - a.score);
            setCurrencies([...newState]);
          }

          if (payload.eventType === "DELETE") {
            const { id } = payload.old;
            setCurrencies((state) => [...state].filter((c) => c.id !== id));
          }
        }
      );

    channel.subscribe((status) => console.log(status));
    return () => {
      channel.unsubscribe();
    };
  }, [currencies, setCurrencies]);

  return (
    <div className="w-full h-full grid gap-40 p-20 grid-cols-3">
      <div className="flex flex-col gap-10 col-span-2">
        <div className="flex flex-col gap-2">
          <span className="text-5xl font-black">Ranking de Criptomoedas</span>
          <span className="text-default-400">
            Posições e pontuações atualizadas em tempo real pelo sistema de
            criação.
          </span>
        </div>

        <div className="grid grid-cols-3 w-full h-[38vh] gap-3 items-end">
          <Podium
            className="h-[75%]"
            label="3º lugar"
            labelColor={tailcolors.amber[700]}
            labelBackground={tailcolors.amber[950]}
            currency={currencies[2]}
          />
          <Podium
            className="h-full"
            label="1º lugar"
            labelColor={tailcolors.yellow[400]}
            labelBackground={tailcolors.yellow[700]}
            currency={currencies[0]}
          />
          <Podium
            className="h-[85%]"
            label="2º lugar"
            labelColor={tailcolors.zinc[400]}
            labelBackground={tailcolors.zinc[600]}
            currency={currencies[1]}
          />
        </div>

        <div className="flex flex-col gap-5">
          <span className="text-2xl font-black">Ranking geral</span>
          <div className="flex flex-wrap gap-3">
            {commonCurrencies.map((currency, i) => (
              <div
                key={currency.id}
                className="w-fit h-fit flex-col bg-default-50 rounded-xl items-center p-3 gap-3 border-4 border-default-100 flex"
              >
                <div className="flex items-center gap-3">
                  <CoinRender
                    color={currency.styles[0]}
                    format={currency.styles[1]}
                    symbol={currency.styles[2]}
                    size="sm"
                  />

                  <div className="flex flex-col">
                    <span style={{ color: colors[currency.styles[0]][2] }}>
                      {currency.name}
                    </span>
                    <span className="text-sm text-default-500">
                      Criada por(a): {currency.createdBy}
                    </span>
                  </div>
                </div>

                <div className="flex w-full">
                  <span className="font-black text-lg bg-default-200 px-4 py-2 rounded-l-lg">
                    {4 + i}º
                  </span>
                  <span className="font-black text-lg w-full justify-center bg-green-500/20 flex gap-2 text-green-500 px-4 py-2 rounded-r-lg">
                    <NumberFlow value={currency.score} />
                    <ChartArea />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full h-full bg-default-50 rounded-xl border-4 border-default-100 overflow-hidden">
        <div className="w-full h-fit p-4 bg-default-100 flex flex-col">
          <span className="text-2xl font-black">
            Últimas criptomoedas criadas
          </span>
          <span className="text-default-500">
            Lista atualizada em tempo real.
          </span>
        </div>
        <div className="flex flex-col">
          {dateOrderedCurrencies.map((currency) => (
            <div
              key={currency.id}
              className="flex p-3 gap-3 border-b border-b-default-100 items-center"
            >
              <CoinRender
                color={currency.styles[0]}
                format={currency.styles[1]}
                symbol={currency.styles[2]}
                size="sm"
              />
              <div className="flex flex-col">
                <span style={{ color: colors[currency.styles[0]][2] }}>
                  {currency.name}
                </span>
                <span className="text-sm text-default-500">
                  Criada por(a): {currency.createdBy}
                </span>
              </div>

              <div className="flex flex-col gap-1 ml-auto items-end">
                <span className="text-default-400 text-sm">
                  {new Date(currency.createdAt).getHours()}:
                  {new Date(currency.createdAt).getMinutes()}
                </span>
                <span className="font-black text-lg w-fit justify-center bg-green-500/20 flex gap-2 text-green-500 px-4 py-2 rounded-lg">
                  <NumberFlow value={currency.score} />
                  <ChartArea />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default View;
