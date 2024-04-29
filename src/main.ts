import { constructQueryString, fetchQuotes, showHelp } from "./helper";
import { Quote } from "./type";
import { parseArguments, shuffleArray } from "./utils";

/**
 * Run the main logic of the CLI
 * Parse args
 * Fetch necessary infos from api
 * Display result
 * @returns
 */
export async function main() {
  const args = process.argv.slice(2);
  // console.debug("args", args);
  const params = parseArguments(args);
  // console.debug("params", params);

  if ("help" in params) {
    await showHelp();
    process.exit();
  }

  const queryString = constructQueryString(params);
  // console.debug("queryString", queryString);

  await fetchQuotes(queryString)
    .then((quotes: Quote[]) => {
      const number = parseInt(params.number) || 1;
      let filteredQuotes = quotes;
      // console.debug("quotes", quotes);
      if (params.keyword) {
        // shuffle after filtering since keyword is not handled by api
        filteredQuotes = shuffleArray<Quote>(
          quotes.filter((quote) => {
            return quote.sentence
              .toLowerCase()
              .includes(params.keyword.toLowerCase());
          })
        );
      }
      // console.debug("filteredQuotes", filteredQuotes);
      if (!filteredQuotes.length) {
        console.log("No quotes found");
        process.exit();
      }

      // slice is only necessary for params.keyword but it is here as an additionnal security for other api calls
      filteredQuotes.slice(0, number).forEach((quote: Quote, index: number) => {
        console.log(
          `Quote ${index + 1}: ${quote.sentence} - "${quote.character.name}"`
        );
      });
    })
    .catch((error) => {
      console.error("Failed to fetch quotes:", error);
    });
}

main();
