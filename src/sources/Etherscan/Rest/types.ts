/**
 * Etherscan API V2 wire shapes used by **`Rest/queries.ts`**.
 *
 * @see https://docs.etherscan.io/api-reference/endpoint/ethgettransactionbyhash
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */

/**
 * `module=proxy` — success is **`{ jsonrpc, id, result }`**; failures may be
 * JSON-RPC **`error`**, or Etherscan’s string-status envelope
 * **`{ status: "0", message: "NOTOK" | "NOTOK-…", result: "<explanation>" }`**
 * (e.g. free API not available for a chain). Do not use `result` from the latter as RPC data.
 */
export type EtherscanProxyJsonRpcWire<T> = {
	jsonrpc?: string
	id?: number
	status?: string
	message?: string
	result?: T | null
	error?: {
		code: number
		message: string
	}
}

/**
 * `module=contract` **`action=getabi`** (and similar) — **`status`** **`1`** / **`0`**, **`result`** string or message.
 * @see https://docs.etherscan.io/api-reference/endpoint/getabi
 */
export type EtherscanStringStatusWire = {
	status: string
	message: string
	result: string
}
