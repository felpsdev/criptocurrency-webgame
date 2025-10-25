"use client";

import { computateQuestionResult, revalidadeQuestions } from "@/app/actions";
import { levels, quiz } from "@/app/lib/quiz";
import { Button, Card, CardBody, Chip, cn, Progress } from "@heroui/react";
import { ArrowRight, CheckIcon, XIcon } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface QuestionProps {
  id: number;
  progress: number;
}

function Question(props: QuestionProps) {
  const { id, progress } = props;
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<null | "danger" | "success">(null);
  const [answer, setAnswer] = useState(-1);
  const question = useMemo(() => quiz[id], [id]);

  const handleNext = useCallback(async () => {
    if (!question || answer === -1 || feedback !== null) return;
    setLoading(true);

    const result = await computateQuestionResult(id, answer);
    setFeedback(result ? "success" : "danger");
    setLoading(false);

    setTimeout(async () => {
      await revalidadeQuestions();
      setFeedback(null);
      setAnswer(-1);
    }, 1500);
  }, [answer, question, feedback]);

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
            color={feedback ? feedback : "primary"}
            onPress={handleNext}
            className="justify-between mt-3"
            startContent={
              feedback && (feedback === "success" ? <CheckIcon /> : <XIcon />)
            }
            endContent={feedback === null && <ArrowRight size={16} />}
          >
            {feedback
              ? feedback === "success"
                ? "Questão Correta."
                : "Questão Errada."
              : "Próxima questão"}
          </Button>
          <Progress size="sm" value={progress} />
        </CardBody>
      </Card>
    </div>
  );
}

export default Question;
