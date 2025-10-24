"use client";

import { Session } from "@/app/lib/drizzle/schema";
import {
  addToast,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { Plus, RefreshCcw, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import useInfiniteScroll from "react-infinite-scroll-hook";
import { createSession, removeSession } from "../actions";

interface SessionsProps {
  initialData: Session[];
  request: (offset: number, length: number) => Promise<Session[]>;
}

function Sessions(props: SessionsProps) {
  const { initialData, request } = props;
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [modalCreator, setModalCreator] = useState("");
  const [modalPhoneNumber, setModalPhoneNumber] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const [sessions, setSessions] = useState(initialData);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleReload = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    const payload = await request(0, sessions.length);
    if (payload) {
      setSessions(payload);
      addToast({
        title: "Recarregado.",
        description: "Lista recarregada com sucesso.",
      });
    }

    setLoading(false);
  }, [loading, sessions]);

  const onLoadMore = useCallback(async () => {
    if (loading) return;
    if (sessions.length === 0) {
      setHasNextPage(false);
      return;
    }

    setLoading(true);

    const payload = await request(sessions.length, initialData.length);
    if (payload.length > 0) {
      setSessions((state) => [...state, ...payload]);
    } else {
      setHasNextPage(false);
    }

    setLoading(false);
  }, [sessions, initialData]);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore,
    rootMargin: "0px 0px 200px 0px",
  });

  const handleCreateSession = useCallback(async () => {
    if (modalLoading) return;
    setModalLoading(true);

    const request = await createSession(modalCreator, modalPhoneNumber);
    if (request) {
      addToast({
        color: "default",
        title: "Sessão criada",
        description: `A sessão foi criada com sucesso. Código: ${request.code}.`,
        timeout: 20000,
        shouldShowTimeoutProgress: true,
      });
      setSessions((state) => [request, ...state]);
    } else {
      addToast({
        color: "danger",
        title: "Erro",
        description: "Algum erro ocorreu na criação da sessão",
      });
    }

    onClose();

    setModalCreator("");
    setModalPhoneNumber("");

    setModalLoading(false);
  }, [modalLoading, modalCreator, modalPhoneNumber]);

  const handleRemoveSession = useCallback(
    async (id: number) => {
      const session = sessions.find((s) => s.id === id);
      const request = await removeSession(id);

      if (request) {
        addToast({
          color: "warning",
          title: "Aviso",
          description: `A sessão de código ${session?.code} foi removida`,
        });
        setSessions((state) => [...state].filter((r) => r.id !== id));
      }
    },
    [sessions, setSessions]
  );

  return (
    <div className="w-full h-fit flex flex-col gap-5">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-5">
          <Button onPress={handleReload} size="sm" isIconOnly variant="flat">
            <RefreshCcw size={16} />
          </Button>
          <span className="text-lg">Sessões</span>
        </div>
        <Button
          onPress={onOpen}
          size="sm"
          color="primary"
          endContent={<Plus size={14} />}
        >
          Nova sessão
        </Button>
      </div>

      <div
        ref={rootRef}
        className="flex flex-col gap-2 max-h-[60vh] overflow-y-scroll"
      >
        {sessions.map((session) => (
          <Card key={session.id} className="min-h-fit overflow-visible">
            <CardBody className="flex flex-row items-center gap-4">
              <div className="w-fit col-span h-full bg-default-100 p-2 px-3 rounded-lg font-black font-mono">
                {session.code}
              </div>

              <div className="grid grid-cols-4 w-full">
                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Nome</span>
                  <span>{session.assignedCreator}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Telefone</span>
                  <span>{session.phoneNumber}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Id da Moeda</span>
                  <span>{session.currencyId || "Não criado"}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-xs text-default-400">Status</span>
                  <span className="font-mono rounded-md">{session.status}</span>
                </div>
              </div>

              <Button
                isIconOnly
                color="danger"
                variant="flat"
                onPress={() => handleRemoveSession(session.id)}
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

        {sessions.length === 0 && (
          <div className="w-full h-fit bg-default-50 p-5 rounded-xl">
            <span className="text-default-500">
              Nenhuma sessão registrada ainda.
            </span>
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-default-900 font-header">
            Criando sessão
          </ModalHeader>

          <ModalBody className="grid grid-cols-2 gap-5">
            <Input
              label="Nome do criador"
              value={modalCreator}
              onValueChange={setModalCreator}
            />
            <Input
              label="Número de telefone"
              value={modalPhoneNumber}
              onValueChange={setModalPhoneNumber}
              maxLength={11}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={modalLoading}
              color="primary"
              onPress={handleCreateSession}
            >
              Criar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default Sessions;
