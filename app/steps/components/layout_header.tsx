"use client";

import { Card, CardHeader } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const pathRelation: Record<string, string[]> = {
  "/steps/style": [
    "Criando sua moeda",
    "Escolha as características de sua moeda agora.",
  ],
  "/steps/questions": [
    "Questionário",
    "Agora responda as perguntas corretamente para ranquear sua moeda",
  ],
  "/steps/finished": [
    "Moeda finalizada.",
    "Sua moeda foi finalizada e adicionada ao ranking geral.",
  ],
};

function LayoutHeader() {
  const pathname = usePathname();
  const relation = useMemo(() => pathRelation[pathname], [pathname]);
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start gap-1 p-5">
        <span className="font-header font-black text-2xl">{relation[0]}</span>
        <span className="text-default-500 text-sm">{relation[1]}</span>
      </CardHeader>
    </Card>
  );
}

export default LayoutHeader;
