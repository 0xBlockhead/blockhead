import bindings from '$/sources/Zcashd/bindings.ts'
import { Source } from '$/sources/Source.ts'
import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import { type as arktype } from 'arktype'


const binding = bindings[Source.ZcashdWallet_JsonRpc][0]
const zecAmount = arktype('/^(?:0|[1-9][0-9]*)(?:\\.[0-9]{1,8})?$/')
const totalBalanceWire = arktype({
	transparent: zecAmount,
	private: zecAmount,
	total: zecAmount,
}).onUndeclaredKey('delete')
const blockCountWire = arktype('number.integer >= 0')

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	value: unknown
) => {
	try {
		return wire.assert(value)
	} catch {
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid ${label} response envelope`)
	}
}

const zatoshisFromZecString = (
	amount: string,
	label: string
) => {
	const [whole, fraction = ''] = amount.split('.')
	const zatoshis = BigInt(whole) * 100_000_000n + BigInt(fraction.padEnd(8, '0'))
	if (zatoshis < 0n)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: invalid ${label}`)

	return zatoshis
}

const getTotalBalance = async (minimumConfirmations: number) => {
	const balance = assertEnvelope(
		'total balance',
		totalBalanceWire,
		await jsonRpc2<unknown>(binding, 'z_gettotalbalance', [minimumConfirmations, true])
	)
	const transparentZatoshis = zatoshisFromZecString(balance.transparent, 'transparent balance')
	const privateZatoshis = zatoshisFromZecString(balance.private, 'private balance')
	const totalZatoshis = zatoshisFromZecString(balance.total, 'total balance')
	if (transparentZatoshis + privateZatoshis !== totalZatoshis)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: total balance does not equal transparent plus private balance`)

	return {
		transparentZatoshis,
		privateZatoshis,
		totalZatoshis,
	}
}

export const getWalletObservation = async () => {
	const [unconfirmed, confirmed, chainTipHeight] = await Promise.all([
		getTotalBalance(0),
		getTotalBalance(1),
		jsonRpc2<unknown>(binding, 'getblockcount', [])
			.then((value) => assertEnvelope('block count', blockCountWire, value)),
	])
	if (confirmed.totalZatoshis > unconfirmed.totalZatoshis)
		throw new Error(`${Source.ZcashdWallet_JsonRpc}: confirmed balance exceeds total balance`)

	return {
		balanceZatoshis: unconfirmed.totalZatoshis,
		verifiedBalanceZatoshis: confirmed.totalZatoshis,
		unshieldedBalanceZatoshis: unconfirmed.transparentZatoshis,
		privateBalanceZatoshis: unconfirmed.privateZatoshis,
		chainTipHeight: BigInt(chainTipHeight),
	}
}
