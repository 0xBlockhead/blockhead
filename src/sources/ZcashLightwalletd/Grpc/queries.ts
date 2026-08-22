import bindings from '$/sources/ZcashLightwalletd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import type {
	ZcashLightwalletdBlockId,
	ZcashLightwalletdBlockIdResponse,
	ZcashLightwalletdCompactBlock,
	ZcashLightwalletdGrpcUnaryCall,
	ZcashLightwalletdInfo,
	ZcashLightwalletdTreeState,
} from '$/sources/ZcashLightwalletd/Grpc/types.ts'

const binding = bindings[Source.ZcashLightwalletd_Grpc][0]
const service = 'cash.z.wallet.sdk.rpc.CompactTxStreamer' as const
let unaryCall: ZcashLightwalletdGrpcUnaryCall | undefined

export const setZcashLightwalletdGrpcUnaryCall = (call: ZcashLightwalletdGrpcUnaryCall | undefined) => {
	unaryCall = call
}

const requireUnaryCall = () => {
	if (unaryCall == null)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: gRPC unary call is not configured`)
	return unaryCall
}

const callUnary = async <Response>(method: string, request: unknown) => {
	try {
		return await requireUnaryCall()({ service, method, request }) as Response
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(`${Source.ZcashLightwalletd_Grpc}:`))
			throw error
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: upstream ${method} failed`, { cause: error })
	}
}

const assertBytes = (value: Uint8Array, label: string, length?: number) => {
	if (!(value instanceof Uint8Array) || (length != null && value.length !== length))
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid ${label}`)
	return value
}

const assertBlockId = (value: ZcashLightwalletdBlockIdResponse) => {
	if (value.height < 0n)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid latest block height`)
	assertBytes(value.hash, 'latest block hash', 32)
	return value
}

export const getLatestBlock = async () => assertBlockId(await callUnary<ZcashLightwalletdBlockIdResponse>('GetLatestBlock', {}))

export const getBlock = async ({ height }: ZcashLightwalletdBlockId) => {
	if (height < 0n)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid block height`)
	const block = await callUnary<ZcashLightwalletdCompactBlock>('GetBlock', { height })
	if (block.height !== height || block.time < 0 || block.vtx.some((transaction) => (
		transaction.index < 0
			|| !(transaction.txid instanceof Uint8Array)
			|| transaction.txid.length !== 32
			|| transaction.spends.some((spend) => spend.nf.length !== 32)
			|| transaction.outputs.some((output) => output.cmu.length !== 32)
			|| transaction.actions.some((action) => action.nullifier.length !== 32 || action.cmx.length !== 32)
	)))
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid compact block response`)
	assertBytes(block.hash, 'block hash', 32)
	assertBytes(block.prevHash, 'previous block hash', 32)
	return block
}

export const getTreeState = async ({ height }: ZcashLightwalletdBlockId) => {
	if (height < 0n)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid tree-state height`)
	const state = await callUnary<ZcashLightwalletdTreeState>('GetTreeState', { height })
	if (state.height !== height || state.time < 0 || state.hash === '' || state.saplingTree === '' || state.orchardTree === '')
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid tree-state response`)
	return state
}

export const getLightdInfo = async () => {
	const info = await callUnary<ZcashLightwalletdInfo>('GetLightdInfo', {})
	if (info.version === '' || info.chainName !== 'main' || info.blockHeight < 0n || info.estimatedHeight < 0n)
		throw new Error(`${Source.ZcashLightwalletd_Grpc}: invalid lightd-info response`)
	return info
}

export const zcashLightwalletdBinding = binding
