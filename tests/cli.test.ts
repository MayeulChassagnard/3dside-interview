import * as https from "https";
import { main as cliMain } from "../src/main";
import { ClientRequest, IncomingMessage } from "http";
import { URL } from "url";
jest.unmock("https");

describe("CLI", () => {
  // let httpsGetSpy: jest.SpyInstance<ClientRequest, [url: string | URL, options: https.RequestOptions, callback?: ((res: IncomingMessage) => void) | undefined], any>;
  let exitSpy: jest.SpyInstance<never, [code?: number | undefined], any>;
  let consoleLogSpy: jest.SpyInstance<
    void,
    [message?: any, ...optionalParams: any[]],
    any
  >;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log");
    // httpsGetSpy = jest.spyOn(https, "get");

    // Mock process.exit to prevent it from exiting the test runner
    exitSpy = jest
      .spyOn(process, "exit")
      .mockImplementation((() => {}) as unknown as () => never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should display a random quote when no arguments are given", async () => {
    process.argv = ["node", "cli.ts"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/random"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Quote 1:")
    );
  });

  it("should display multiple quotes when --number is specified", async () => {
    process.argv = ["node", "cli.ts", "--number=3"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/random/3"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Quote 3:")
    );
  });

  it("should display a quote from a specific character when --character is specified", async () => {
    process.argv = ["node", "cli.ts", "--character=bill"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/author/bill"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Quote 1:") && expect.stringContaining("Bill")
    );
  });

  it("should handle multiple flags --number and --character", async () => {
    process.argv = ["node", "cli.ts", "--number=2", "--character=bill"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/author/bill/2"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Quote 2:") && expect.stringContaining("Bill")
    );
  });

  it("should handle multiple flags --keyword and --number", async () => {
    process.argv = ["node", "cli.ts", "--number=2", "--keyword=j'aime"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/characters"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Quote 2:") && expect.stringContaining("'aime")
    );
  });
  it("should handle wrong character", async () => {
    process.argv = ["node", "cli.ts", "--character=bil"];
    await cliMain();
    // expect(httpsGetSpy).toHaveBeenCalledWith(
    //   "https://api.oss117quotes.xyz/v1/author/bil"
    // );
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Character not Found in list:")
    );
  });
  it("should display help when --help is specified", async () => {
    process.argv = ["node", "cli.ts", "--help"];
    await cliMain();
    expect(exitSpy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining("Usage:")
    );
  });
});
