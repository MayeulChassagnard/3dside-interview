import * as https from "https";

/**
 * Extract Arguments from cli
 * @param args the raw args given from cli
 * @returns correctly typed and parsed args as object
 */
export function parseArguments(args: string[]) {
  const params: { [key: string]: string } = {};

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("=");
      params[key] = value;
    }
  });

  return params;
}

/**
 * Fetch Data such axios or node fetch would do
 * @param url 
 * @returns 
 */
export function fetchData(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            console.error("Error parsing data:", data);
            reject({ data });
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Fisher-Yates shuffle implementation
export function shuffleArray<T>(array: T[]): T[] {
  let m = array.length,
    t,
    i;

  // While remaining elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}
