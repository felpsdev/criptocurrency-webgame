import { fetchCurrencies } from "./actions";
import View from "./components/view";

async function Rank() {
  const currencies = await fetchCurrencies();
  return <View initialData={currencies} />;
}

export default Rank;
