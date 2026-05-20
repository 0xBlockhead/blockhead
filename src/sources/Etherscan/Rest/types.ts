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

/**
 * `module=gastracker`, `action=gasoracle`.
 * @see https://docs.etherscan.io/api-reference/endpoint/gasoracle
 */
export type EtherscanGasOracleResultWire = {
	LastBlock: string
	SafeGasPrice: string
	ProposeGasPrice: string
	FastGasPrice: string
	suggestBaseFee?: string
	gasUsedRatio?: string
}

export type EtherscanGasOracleWire = {
	status: string
	message: string
	result: EtherscanGasOracleResultWire
}

export type EtherscanContractCreationRowWire = {
	contractAddress?: string
	contractCreator?: string
	txHash?: string
}

export type EtherscanContractCreationWire = {
	status: string
	message: string
	result: EtherscanContractCreationRowWire[] | string
}

export type EtherscanContractSourceRowWire = {
	SourceCode?: string
	ABI?: string
	ContractName?: string
	Implementation?: string
	Proxy?: string
}

export type EtherscanContractSourceCodeWire = {
	status: string
	message: string
	result: EtherscanContractSourceRowWire[] | string
}
