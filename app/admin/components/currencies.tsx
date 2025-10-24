"use client";

import CoinRender from "@/app/components/coin-render";
import { colors } from "@/app/components/coin-render/data";
import { addToast, Button, Card, CardBody } from "@heroui/react";
import { RefreshCcw, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { CurrencyWithSession, removeCurrency } from "../actions";

interface CurrenciesProps {
  initialData: CurrencyWithSession[];
  request: (offset: number, length: number) => Promise<CurrencyWithSession[]>;
}

function Currencies(props: CurrenciesProps) {
  const { initialData, request } = props;

  const [currencies, setCurrencies] = useState(initialData);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleReload = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const payload = await request(0, currencies.length);
    if (payload) {
      setCurrencies(payload);
      addToast({
        title: "Recarregado.",
        description: "Lista recarregada com sucesso.",
      });
    }

    setLoading(false);
  }, [loading, currencies]);

  const onLoadMore = useCallback(async () => {
    if (loading) return;
    if (currencies.length === 0) {
      setHasNextPage(false);
      return;
    }

    setLoading(true);

    const payload = await request(currencies.length, initialData.length);
    if (payload.length > 0) {
      setCurrencies((state) => [...state, ...payload]);
    } else {
      setHasNextPage(false);
    }

    setLoading(false);
  }, [currencies, initialData]);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    rootMargin: "0px 0px 200px 0px",
  });

  const handleRemoveCurrency = useCallback(
    async (id: number) => {
      const currency = currencies.find((s) => s.id === id);
      const request = await removeCurrency(id);

      if (request) {
        addToast({
          color: "warning",
          title: "Aviso",
          description: `O criptomoeda ${currency?.name} foi removida`,
        });
        setCurrencies((state) => [...state].filter((r) => r.id !== id));
      }
    },
    [currencies, setCurrencies]
  );

  return (
    <div className="w-full h-fit flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-5">
          <Button onPress={handleReload} size="sm" isIconOnly variant="flat">
            <RefreshCcw size={16} />
          </Button>
          <span className="text-lg">Criptomoedas</span>
        </div>
      </div>

      <div
        ref={rootRef}
        className="flex flex-col gap-2 max-h-[60vh] overflow-y-scroll"
      >
        {currencies.map((currency) => (
          <Card key={currency.id} className="min-h-fit overflow-visible">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="flex flex-col items-center px-4">
                <CoinRender
                  color={currency.styles[0]}
                  format={currency.styles[1]}
                  symbol={currency.styles[2]}
                  size="sm"
                />
                <span
                  className="text-center"
                  style={{ color: colors[currency.styles[0]][2] }}
                >
                  {currency.name}
                </span>
              </div>

              <div className="grid grid-cols-4 w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-default-400">
                    Identificação
                  </span>
                  <span>{currency.id}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Pontuação</span>
                  <span>{currency.score}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Quiz</span>
                  <span>
                    {
                      currency.sessionAnswers?.filter(
                        (answer: any) => answer.score > 0
                      ).length
                    }
                    /8
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">
                    Código do Criador
                  </span>
                  <span>{currency.sessionCode || "Inexistente"}</span>
                </div>
              </div>

              <Button
                isIconOnly
                color="danger"
                variant="flat"
                onPress={() => handleRemoveCurrency(currency.id)}
              >
                <Trash size="16" />
              </Button>
            </CardBody>
          </Card>
        ))}

        {hasNextPage && (
          <span
            ref={infiniteRef}
            className="w-full h-fit text-xs flex items-center justify-center text-default-400"
          >
            Carregando...
          </span>
        )}

        {currencies.length === 0 && (
          <div className="w-full h-fit bg-default-50 p-5 rounded-xl">
            <span className="text-default-500">
              Nenhuma criptomoeda registrada ainda.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Currencies;
