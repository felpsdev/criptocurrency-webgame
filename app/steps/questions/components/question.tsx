"use client";

import { computateQuestionResult } from "@/app/actions";
import { levels, quiz } from "@/app/lib/quiz";
import { Button, Card, CardBody, Chip, cn, Progress } from "@heroui/react";
import { ArrowRight } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface QuestionProps {
  id: number;
  progress: number;
}

function Question(props: QuestionProps) {
  const { id, progress } = props;
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(-1);
  const question = useMemo(() => quiz[id], [id]);

  const handleNext = useCallback(async () => {
    if (!question || answer === -1) return;
    setLoading(true);

    await computateQuestionResult(id, answer);

    setAnswer(-1);
    setLoading(false);
  }, [answer, question]);

  return (
    <div className="flex flex-col gap-5">
      <Card>
        <CardBody className="p-5 gap-2 flex flex-col">
          <div className="flex justify-between items-end">
            <span className="text-xs text-default-400 font-black">
              PERGUNTA
            </span>
            <Chip
              radius="sm"
              size="sm"
              variant="flat"
              color={levels[question.level].color as "success" | "warning"}
            >
              {levels[question.level].label}
            </Chip>
          </div>
          <span className="text-lg font-bold">{question.question}</span>
        </CardBody>
      </Card>
      <Card>
        <CardBody className="p-5 flex flex-col gap-3">
          {question.options.map((r, i) => (
            <div
              onClick={() => setAnswer(i)}
              key={i}
              className={cn(
                "rounded-lg transition-all w-full h-fit bg-default-100 cursor-pointer border-2 border-default-50",
                { "border-primary": answer === i }
              )}
            >
              <CardBody>{r}</CardBody>
            </div>
          ))}
          <Button
            isLoading={loading}
            isDisabled={answer === -1}
            color="primary"
            onPress={handleNext}
            className="justify-between mt-3"
            endContent={<ArrowRight size={16} />}
          >
            Próxima questão
          </Button>
          <Progress size="sm" value={progress} />
        </CardBody>
      </Card>
    </div>
  );
}

export default Question;
