import { fetchCurrencies } from "./actions";
import View from "./components/view";

async function Rank() {
  const currencies = await fetchCurrencies();
  return (
    <View
      initialData={currencies.map((c) => ({
        ...c,
        id: parseInt(c.id.toString()),
      }))}
    />
  );
}

export default Rank;
