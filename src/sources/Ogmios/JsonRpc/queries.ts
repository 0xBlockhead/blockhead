import { jsonRpc2 } from '$/sources/_shared/wire/JsonRpc2/client.ts'
import bindings from '$/sources/Ogmios/bindings.ts'
import {
	ogmiosBlockHeightWire,
	ogmiosEpochWire,
	ogmiosPointWire,
	ogmiosProtocolParametersWire,
	type OgmiosBlockHeight,
	type OgmiosEpoch,
	type OgmiosPoint,
	type OgmiosProtocolParameters,
} from '$/sources/Ogmios/JsonRpc/types.ts'
import { Source } from '$/sources/Source.ts'

const binding = bindings[Source.Ogmios_JsonRpc].at(0)!

const assertEnvelope = <_Value>(
	label: string,
	wire: {
		assert: (value: unknown) => _Value
	},
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`Ogmios_JsonRpc: invalid ${label} response envelope`)
	}
}

const rejectOrigin = (
	label: string,
	value: unknown
) => {
	if (value === 'origin')
		throw new Error(`Ogmios_JsonRpc: ${label} is origin`)

	return value
}

export const getLedgerTip = async (): Promise<OgmiosPoint> => (
	assertEnvelope(
		'ledger tip',
		ogmiosPointWire,
		rejectOrigin(
			'ledger tip',
			await jsonRpc2(
				binding,
				'queryLedgerState/tip'
			)
		)
	)
)

export const getNetworkTip = async (): Promise<OgmiosPoint> => (
	assertEnvelope(
		'network tip',
		ogmiosPointWire,
		rejectOrigin(
			'network tip',
			await jsonRpc2(
				binding,
				'queryNetwork/tip'
			)
		)
	)
)

export const getNetworkBlockHeight = async (): Promise<OgmiosBlockHeight> => (
	assertEnvelope(
		'block height',
		ogmiosBlockHeightWire,
		rejectOrigin(
			'block height',
			await jsonRpc2(
				binding,
				'queryNetwork/blockHeight'
			)
		)
	)
)

export const getEpoch = async (): Promise<OgmiosEpoch> => (
	assertEnvelope(
		'epoch',
		ogmiosEpochWire,
		await jsonRpc2(
			binding,
			'queryLedgerState/epoch'
		)
	)
)

export const getProtocolParameters = async (): Promise<OgmiosProtocolParameters> => (
	assertEnvelope(
		'protocol parameters',
		ogmiosProtocolParametersWire,
		await jsonRpc2(
			binding,
			'queryLedgerState/protocolParameters'
		)
	)
)
