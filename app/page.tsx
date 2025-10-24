import CodeInput from "./components/code-input";
import { getSession } from "./lib/session";

export default async function Page() {
  const session = await getSession();
  return (
    <div className="w-full h-full flex items-center justify-center">
      {!session && <CodeInput />}
    </div>
  );
}
