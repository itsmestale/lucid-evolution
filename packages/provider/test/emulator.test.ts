import {
  Assets,
  Datum,
  Delegation,
  ProtocolParameters,
  UTxO,
} from "@lucid-evolution/core-types";
import { assert, describe, expect, test } from "vitest";
import { expectedProtocolParameters } from "./protocolParameters";
import { Emulator } from "../src/emulator.js";
import { generateSeedPhrase } from "@lucid-evolution/utils";
import { walletFromSeed } from "../../lucid/src/index.js";

async function generateAccount(assets: Assets) {
  const seedPhrase = generateSeedPhrase();
  return {
    seedPhrase,
    address: walletFromSeed(seedPhrase).address,
    assets,
  };
}

let emulator: any;

//TODO: improve test assetion
describe.sequential("Emulator", () => {
  test("createEmulator", async () => {
    let ACCOUNT_0 = await generateAccount({ lovelace: 75000000000n });
    let ACCOUNT_1 = await generateAccount({ lovelace: 100000000n });

    emulator = new Emulator([ACCOUNT_0, ACCOUNT_1]);
  });

  test("getProtocolParameters", async () => {
    const pp: ProtocolParameters = await emulator.getProtocolParameters();
    assert.deepEqual(pp, expectedProtocolParameters);
  });

  test("getUtxos", async () => {
    const utxos: UTxO[] = await emulator.getUtxos(
      "addr_test1qrngfyc452vy4twdrepdjc50d4kvqutgt0hs9w6j2qhcdjfx0gpv7rsrjtxv97rplyz3ymyaqdwqa635zrcdena94ljs0xy950",
    );
    assert(utxos);
  });

  test("getUtxosWithUnit", async () => {
    const utxos: UTxO[] = await emulator.getUtxosWithUnit(
      "addr1q8vaadv0h7atv366u6966u4rft2svjlf5uajy8lkpsgdrc24rnskuetxz2u3m5ac22s3njvftxcl2fc8k8kjr088ge0qpn6xhn",
      "85152e10643c1440ba2ba817e3dd1faf7bd7296a8b605efd0f0f2d1844696d656e73696f6e426f78202330313739",
    );
    assert(utxos);
  });

  test("getUtxoByUnit", async () => {
    const utxo: UTxO = await emulator.getUtxoByUnit(
      "85152e10643c1440ba2ba817e3dd1faf7bd7296a8b605efd0f0f2d1844696d656e73696f6e426f78202330313739",
    );
    assert(utxo);
  });

  test("getUtxosByOutRef", async () => {
    const utxos: UTxO[] = await emulator.getUtxosByOutRef([
      {
        txHash:
          "c6ee20549eab1e565a4bed119bb8c7fc2d11cc5ea5e1e25433a34f0175c0bef6",
        outputIndex: 0,
      },
    ]);
    assert(utxos);
  });

  test("getDelegation", async () => {
    const delegation: Delegation = await emulator.getDelegation(
      "stake1uyrx65wjqjgeeksd8hptmcgl5jfyrqkfq0xe8xlp367kphsckq250",
    );
    assert(delegation);
  });

  test("getDatum", async () => {
    const datum: Datum = await emulator.getDatum(
      "818ee3db3bbbd04f9f2ce21778cac3ac605802a4fcb00c8b3a58ee2dafc17d46",
    );
    assert(datum);
  });

  test("awaitTx", async () => {
    const isConfirmed: boolean = await emulator.awaitTx(
      "f144a8264acf4bdfe2e1241170969c930d64ab6b0996a4a45237b623f1dd670e",
    );
    assert(isConfirmed);
  });

  test("submitTxBadRequest", async () => {
    await expect(() => emulator.submitTx("80")).rejects.toThrowError();
  });
});
