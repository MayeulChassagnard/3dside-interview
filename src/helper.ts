import { API_URL } from "./const";
import { CharacterQuote, Quote } from "./type";
import { fetchData } from "./utils";

export async function showHelp() {
  console.log("Usage: node oss117-cli [options] (cumulative options enabled");
  console.log("Options:");
  console.log("  --number=x    Display x random quotes");
  console.log(
    "  --character=x Display a random quote from the specified character"
  );
  console.log("  --keyword=x   Display a random quote containing the keyword");
  console.log("  --help        Display this help message");
  console.log("Note - character list allowed:");
  await displayCharacters();
}

/**
 * Given a list of parameters, build the correct api call route
 * in order to fetch the best data
 * @param params
 * @returns
 */
export function constructQueryString(params: {
  [key: string]: string;
}): string {
  let url = `/random`; // default cli without parameter should return one random quote
  /**
   * Due to cumulative parameters, and to maximize call to api,
   * make sure to fetch best route depending of the case
   * for example: be aware if character + number + keyword:
   * - first return character's quote then filter keyword, then randomize
   * to avoid returning a random quote that does not contain keyword
   */
  /**
   * Due to an error in the api, force fetching all characters as soon as keyword is specified
   * (/author/x/number with number empty should return ALL quotes from the author)
   * Instead it returns just one so it needs to fetch all via /characters
   */
  if (params.keyword) {
    url = `/characters`;
  } else if (params.character) {
    url = `/author/${params.character}`;
    if (params.number) {
      url += "/" + params.number;
    }
  } else if (params.number) {
    url = `/random/${params.number}`;
  }

  return url;
}

/**
 * Convert Characters list to quotes format
 * @param characterQuotes 
 * @returns 
 */
export function convertToQuotes(characterQuotes: CharacterQuote[]): Quote[] {
  const quotes = characterQuotes.flatMap((character) =>
    character.quotes.map((sentence) => ({
      sentence,
      character: {
        name: character.name,
        slug: character.slug,
      },
    }))
  );
  return quotes;
}

/**
 * Fetch api to always return a list of Quote based on query
 * @param query 
 * @returns 
 */
export function fetchQuotes(query: string = ""): Promise<Quote[]> {
  return fetchData(API_URL + query)
    .then((data) => {
      let jsonData = data;
      if (jsonData.length && jsonData[0].quotes) {
        // convert Charceters Quotes to Correct Format
        jsonData = convertToQuotes(jsonData);
      }
      // make sure it will return an array
      if (!(jsonData instanceof Array)) {
        jsonData = [jsonData];
      }
      return jsonData;
    })
    .catch(async (error) => {
      console.error(
        `Error: Could not fetch ${API_URL + query}\nerror:${JSON.stringify(error)}`
      );
      if (error.data === "" && query.includes("author")) {
        console.log("Character not Found in list:");
        await displayCharacters();
        return []
      }
    });
}

/**
 * Fetch Charceters slug from api
 * @returns String list based from characters's slug
 */
async function getCharacterList(): Promise<string[]> {
  const charactersUrl = API_URL + "/characters";
  const characters: CharacterQuote[] = await fetchData(charactersUrl);
  return characters.map((char) => char.slug);
}

async function displayCharacters() {
  try {
    const characterSlugs = await getCharacterList();
    console.log(characterSlugs.join(", "));
  } catch (error) {
    console.error("Error fetching characters:", error);
  }
}
