import { sessionIsAdmin } from "../lib/session";
import { requestCurrencies, requestSessions } from "./actions";
import Currencies from "./components/currencies";
import Login from "./components/login";
import Sessions from "./components/sessions";

async function Page() {
  const isAdmin = await sessionIsAdmin();
  if (!isAdmin) return <Login />;

  const [initialSessions, initialCurrencies] = await Promise.all([
    requestSessions(0),
    requestCurrencies(0),
  ]);

  return (
    <div className="w-full h-full flex items-center justify-center px-5">
      <div className="max-w-7xl w-full h-fit grid grid-cols-2 gap-5 max-md:grid-cols-1">
        <Sessions initialData={initialSessions} request={requestSessions} />
        <Currencies
          initialData={initialCurrencies}
          request={requestCurrencies}
        />
      </div>
    </div>
  );
}

export default Page;
