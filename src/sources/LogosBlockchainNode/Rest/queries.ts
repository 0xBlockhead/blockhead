import type { JsonValue } from '$/typescript/JsonValue.ts'
import { getJson } from '$/sources/_shared/wire/HttpRest/client.ts'
import { firstHttpUrlForBinding } from '$/sources/_runtime/http.ts'
import {
	chainServiceInfo,
	libp2pInfo,
	walletBalance,
} from '$/sources/LogosBlockchainNode/Rest/types.ts'
import bindings from '$/sources/LogosBlockchainNode/bindings.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.LogosBlockchainNode_Rest][0]

const zkPublicKeyPathSegment = (publicKey: string) => {
	const hex = (
		publicKey.startsWith('0x') || publicKey.startsWith('0X') ?
			publicKey.slice(2)
		:
			publicKey
	).toLowerCase()
	if (!/^[0-9a-f]{64}$/.test(hex))
		throw new Error('LogosBlockchainNode_Rest: invalid zk public key')
	return hex
}

export const getCryptarchiaInfo = async () => (
	chainServiceInfo.assert(
		await getJson<JsonValue>(
			binding,
			'/cryptarchia/info'
		)
	)
)

export const getNetworkInfo = async () => (
	libp2pInfo.assert(
		await getJson<JsonValue>(
			binding,
			'/network/info'
		)
	)
)

export const getWalletBalance = async (publicKey: string) => (
	walletBalance.assert(
		await getJson<JsonValue>(
			binding,
			`/wallet/${encodeURIComponent(zkPublicKeyPathSegment(publicKey))}/balance`
		)
	)
)

export const nodeEndpoint = () => (
	firstHttpUrlForBinding(binding).replace(/\/$/, '')
)
