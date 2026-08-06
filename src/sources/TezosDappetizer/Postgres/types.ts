import {
	type as arktype,
} from 'arktype'


export const dappetizerBlockWire = arktype({
	hash: 'string > 0',
	predecessor: 'string > 0',
	level: 'number.integer >= 0',
	timestamp: 'string | Date | number',
})

export type DappetizerBlock = typeof dappetizerBlockWire.infer

export const dappetizerSettingsWire = arktype({
	chainId: 'string > 0',
})

export type DappetizerSettings = typeof dappetizerSettingsWire.infer

export const dappetizerContractWire = arktype({
	address: 'string > 0',
	'name?': 'string | null',
	'description?': 'string | null',
	firstOperationGroupHash: 'string > 0',
	firstBlockHash: 'string > 0',
})

export type DappetizerContract = typeof dappetizerContractWire.infer

export const dappetizerTokenWire = arktype({
	id: 'string | number',
	contractAddress: 'string > 0',
	'name?': 'string | null',
	'symbol?': 'string | null',
	'decimals?': 'number.integer | null',
	firstOperationGroupHash: 'string > 0',
	firstBlockHash: 'string > 0',
})

export type DappetizerToken = typeof dappetizerTokenWire.infer

export const dappetizerBalanceWire = arktype({
	ownerAddress: 'string > 0',
	amount: 'string | number',
	operationGroupHash: 'string > 0',
	tokenId: 'string | number',
	tokenContractAddress: 'string > 0',
	validFromBlockHash: 'string > 0',
	'validUntilBlockHash?': 'string | null',
	'level?': 'number.integer >= 0',
	'timestamp?': 'string | Date | number | null',
})

export type DappetizerBalance = typeof dappetizerBalanceWire.infer

export const dappetizerActionWire = arktype({
	order: 'number.integer >= 0',
	type: 'string > 0',
	operationGroupHash: 'string > 0',
	'amount?': 'string | number | null',
	'fromAddress?': 'string | null',
	'toAddress?': 'string | null',
	'ownerAddress?': 'string | null',
	blockHash: 'string > 0',
	tokenId: 'string | number',
	tokenContractAddress: 'string > 0',
	'level?': 'number.integer >= 0',
	'timestamp?': 'string | Date | number | null',
})

export type DappetizerAction = typeof dappetizerActionWire.infer


export const timestampMsFromWire = (
	value: string | Date | number | null | undefined
) => {
	if (value == null)
		return undefined
	if (typeof value === 'number') {
		if (!Number.isFinite(value))
			throw new Error('TezosDappetizer_Postgres: invalid timestamp number')
		return value
	}
	if (value instanceof Date) {
		const timestampMs = value.getTime()
		if (!Number.isFinite(timestampMs))
			throw new Error('TezosDappetizer_Postgres: invalid Date timestamp')
		return timestampMs
	}
	const timestampMs = Date.parse(value)
	if (!Number.isFinite(timestampMs))
		throw new Error('TezosDappetizer_Postgres: invalid timestamp string')
	return timestampMs
}

export const bigintFromWire = (
	value: string | number,
	label: string
) => {
	try {
		const amount = BigInt(
			typeof value === 'number' ?
				Math.trunc(value)
			:
				value.split('.')[0] ?? value
		)
		if (amount < 0n)
			throw new Error(`TezosDappetizer_Postgres: negative ${label}`)
		return amount
	} catch (cause) {
		throw new Error(`TezosDappetizer_Postgres: invalid ${label}`, {
			cause,
		})
	}
}
