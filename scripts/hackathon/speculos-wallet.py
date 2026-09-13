"""Run the official emulator with the dedicated test seed read inside its container."""

import json
import sys

from speculos.main import main


def run():
    with open("/wallet.json", encoding="utf-8") as wallet_file:
        wallet = json.load(wallet_file)
    if wallet["purpose"] != "ETHOnline 2026 testnet only; never use with real assets":
        raise ValueError("Unexpected wallet profile")
    # Python argv is set in-process: the mnemonic never enters Docker's command
    # configuration, the host shell, or the operating system's process arguments.
    sys.argv = [
        "speculos",
        "--display", "headless",
        "--model", "flex",
        "--api-port", "5000",
        "--seed", wallet["mnemonic"],
        "/app.elf",
    ]
    return main()


if __name__ == "__main__":
    try:
        run()
    except Exception:
        print("Speculos test-wallet startup failed; secret details withheld.", file=sys.stderr)
        sys.exit(1)
