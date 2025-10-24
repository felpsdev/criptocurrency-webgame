"use client";

import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  InputOtp,
} from "@heroui/react";
import { useState } from "react";
import { assembleCode } from "../actions";

function CodeInput() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const payload = await assembleCode(code);
    if (payload) {
      addToast({
        color: "success",
        title: "Sucesso",
        description: `Código autenticado!`,
      });
    } else {
      addToast({
        color: "danger",
        title: "Erro",
        description: "O código informado não foi cadastrado",
      });
    }

    setLoading(false);
  };

  return (
    <Card className="w-fit">
      <CardHeader className="flex flex-col items-start gap-1 p-5">
        <span className="font-header font-black text-2xl">
          Código de Acesso
        </span>
        <span className="text-default-500 text-sm">
          Digite o código informado pelo coordenador para iniciar.
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="px-5 items-center">
        <InputOtp value={code} onValueChange={setCode} size="lg" length={5} />
      </CardBody>
      <Divider />
      <CardFooter className="p-5">
        <Button
          type="submit"
          onPress={handleSubmit}
          fullWidth
          isLoading={loading}
          isDisabled={code.length < 5}
          color="primary"
        >
          Iniciar
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CodeInput;
