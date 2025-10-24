"use client";

import { loginAsAdmin } from "@/app/actions";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
} from "@heroui/react";
import { useCallback, useState } from "react";

function Login() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);

    const form = new FormData();
    form.append("admin_key", key);

    const request = await loginAsAdmin(form);
    if (request) {
      addToast({
        color: "success",
        title: "Login sucedido!",
        description: "Você entrou como admin no site.",
      });
    } else {
      addToast({
        color: "danger",
        title: "Inválida",
        description: "Chave de acesso inserida é inválida.",
      });
    }

    setLoading(false);
  }, [key]);

  return (
    <div className="w-full h-full items-center justify-center flex">
      <Card className="w-fit">
        <CardHeader className="flex flex-col items-start gap-1 p-5">
          <span className="font-header font-black text-2xl">
            Código de Acesso
          </span>
          <span className="text-default-500 text-sm">
            Digite o código para entrar como admin no site.
          </span>
        </CardHeader>
        <Divider />
        <CardBody className="p-5 items-center">
          <Input label="Chave de acesso" value={key} onValueChange={setKey} />
        </CardBody>
        <Divider />
        <CardFooter className="p-5">
          <Button
            type="submit"
            onPress={handleSubmit}
            fullWidth
            isLoading={loading}
            isDisabled={key.length === 0}
            color="primary"
          >
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
