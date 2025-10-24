import { getSession } from "@/app/lib/session";
import { redirect } from "next/navigation";
import Question from "./components/question";

async function Page() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const questionId = session.questionIds[session.questionStepId];
  const progress =
    (session.questionStepId / (session.questionIds.length - 1)) * 100;

  return (
    <div>
      <Question id={questionId} progress={progress} />
    </div>
  );
}

export default Page;
