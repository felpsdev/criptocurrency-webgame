"use client";

import { createCurrency, updateSessionStatus } from "@/app/actions";
import CoinRender from "@/app/components/coin-render";
import { colors, formats, symbols } from "@/app/components/coin-render/data";
import LineSelection from "@/app/components/line-selection";
import { genRandomInt } from "@/app/lib/math";
import { addToast, Button, Card, CardBody, Input } from "@heroui/react";
import { Dice5 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function Page() {
  const [name, setName] = useState("");
  const [format, setFormat] = useState(0);
  const [symbol, setSymbol] = useState(0);
  const [color, setColor] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRandomize = useCallback(() => {
    const [randFormat, randSymbol, randColors] = [
      genRandomInt(0, formats.length - 1),
      genRandomInt(0, symbols.length - 1),
      genRandomInt(0, colors.length - 1),
    ];

    setFormat(randFormat);
    setSymbol(randSymbol);
    setColor(randColors);
  }, [formats, symbols, colors]);

  useEffect(() => {
    handleRandomize();
  }, []);

  const handleUpdate = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const request = await createCurrency(name, color, format, symbol);
    if (request) {
      const sessionUpdate = await updateSessionStatus("answering");
      if (sessionUpdate) {
        addToast({
          color: "success",
          title: "Registrada.",
          description: "Moeda registrada com sucesso!",
        });
      } else {
        addToast({
          color: "danger",
          title: "Erro.",
          description: "Algum erro ao atualizar a sessão.",
        });
      }
    } else {
      addToast({
        color: "danger",
        title: "Erro.",
        description: "Algum erro aconteceu ao registrar a moeda.",
      });
    }

    setLoading(false);
  }, [loading, name, symbol, color, format]);

  return (
    <div className="w-full max-w-[500px]">
      <Card className="w-full h-fit">
        <CardBody className="flex flex-col p-0 pt-5">
          <div className="w-full bg-background/50 py-2 flex flex-col items-center relative">
            <CoinRender color={color} symbol={symbol} format={format} />
            <span style={{ color: colors[color][2] }}>{name}</span>
            <Button
              variant="flat"
              isIconOnly
              className="absolute right-2 top-2"
              onPress={handleRandomize}
            >
              <Dice5 />
            </Button>
          </div>

          <div className="w-full h-fit flex flex-col p-5 gap-3">
            <Input
              minLength={5}
              maxLength={20}
              value={name}
              onValueChange={setName}
              label="Nome"
            />
            <LineSelection
              label="Formato"
              data={formats.map((r, i) => ({
                label: r[0] as string,
                value: i,
              }))}
              selected={format}
              onChange={setFormat}
            />
            <LineSelection
              label="Símbolo"
              data={symbols.map((r, i) => ({
                label: r[0] as string,
                value: i,
              }))}
              selected={symbol}
              onChange={setSymbol}
            />
            <LineSelection
              label="Cor"
              data={colors.map((r, i) => ({
                label: r[0] as string,
                value: i,
              }))}
              selected={color}
              onChange={setColor}
            />
            <Button
              onPress={handleUpdate}
              isLoading={loading}
              isDisabled={name.length < 5}
              color="primary"
            >
              Ir para questionário
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Page;
