import { type as arktype } from 'arktype'


const quantityHex = arktype('/^0x(?:0|[1-9a-fA-F][0-9a-fA-F]*)$/')
const abiHex = arktype('/^0x([0-9a-fA-F]{64})+$/')


export const chainlinkJsonRpcSuccessWire = arktype({
	jsonrpc: "'2.0'",
	id: 'string',
	result: 'string',
	'error?': 'undefined',
}).onUndeclaredKey('delete')

export const chainlinkJsonRpcErrorWire = arktype({
	jsonrpc: "'2.0'",
	id: 'string',
	error: {
		code: 'number.integer',
		message: 'string > 0',
	},
	'result?': 'undefined',
}).onUndeclaredKey('delete')

export const chainlinkJsonRpcResponseWire = chainlinkJsonRpcSuccessWire
	.or(chainlinkJsonRpcErrorWire)

export const chainlinkQuantityHexWire = quantityHex
export const chainlinkAbiHexWire = abiHex

export type ChainlinkJsonRpcResponse = typeof chainlinkJsonRpcResponseWire.infer
