/**
 * Extract Arguments from cli
 * @param args the raw args given from cli
 * @returns correctly typed and parsed args as object
 */
export function parseArguments(args: string[]) {
  const params: { [key: string]: string } = {};

  args.forEach((arg) => {
    if (arg.startsWith("--")) {
      const [key, value] = arg.slice(2).split("="); // TODO verif
      params[key] = value;
    }
  });

  return params;
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
