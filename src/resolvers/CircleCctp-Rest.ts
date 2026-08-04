import { hexLowerOfByteSize, with0xHex } from '$/lib/hexLowerOfByteSize.ts'
import {
	defineResolver,
	type RegisteredSourceResolverModule,
} from '$/resolvers/defineResolver.ts'
import {
	EntityMetaKey,
	type EntitySelector,
} from '$/schema/$schema.ts'
import { EntityType } from '$/schema/EntityType.ts'
import { schema } from '$/schema/index.ts'
import type { components } from '$/sources/CircleCctp/OpenApi/openapi.d.ts'
import { Source } from '$/sources/Source.ts'

type CctpMessageId = EntitySelector<typeof schema, EntityType.CctpMessage>
type CctpDomainSupportId = EntitySelector<typeof schema, EntityType.CctpDomainSupport>
type MessageV2 = components['schemas']['MessageV2']
type MessagesV2Response = components['schemas']['MessagesV2Response']
type BurnFeeRow = components['schemas']['USDCBurnFeesResponseV2'][number]

const irisCctpVersion = 2

const assertIrisSource = (
	source: string,
	label: string
) => {
	if (source !== Source.CircleCctpIris)
		throw new Error(`CircleCctpIris: unsupported ${label} source ${source}`)
}

const assertDomainSelector = (
	domain: CctpDomainSupportId,
	label: string
) => {
	if (!Number.isSafeInteger(domain.domainId) || domain.domainId < 0)
		throw new Error(`CircleCctpIris: invalid ${label} domain id`)
	if (domain.cctpVersion !== irisCctpVersion)
		throw new Error(`CircleCctpIris: unsupported ${label} cctpVersion ${domain.cctpVersion}`)
}

const optionalNumberFromWire = (
	value: string | undefined
) => {
	if (value == null || value === '')
		return undefined

	const parsed = Number(value)
	if (!Number.isSafeInteger(parsed))
		throw new Error(`CircleCctpIris: invalid integer wire value ${value}`)

	return parsed
}

const optionalBigIntFromWire = (
	value: string | number | undefined
) => {
	if (value == null || value === '')
		return undefined

	const text = String(value)
	if (!/^(0|[1-9]\d*)$/.test(text))
		throw new Error(`CircleCctpIris: invalid bigint wire value ${text}`)

	return BigInt(text)
}

const optionalZeroExHex = (
	value: string | null | undefined
) => {
	if (value == null || value === '' || value === 'PENDING')
		return undefined

	const hex = with0xHex(value)
	return (
		/^0x[0-9a-f]*$/.test(hex) ?
			hex
		:
			undefined
	)
}

const domainRef = (
	domainId: number
) => ({
	[EntityMetaKey.Selector]: {
		cctpVersion: irisCctpVersion,
		domainId,
	},
})

const messageMatchingNonce = (
	result: MessagesV2Response,
	nonce: string
) => {
	const message = result.messages.find((candidate) => (
		candidate.decodedMessage?.nonce === nonce
		|| candidate.eventNonce === nonce
	))
	if (message == null)
		throw new Error(`CircleCctpIris: no message for nonce ${nonce}`)

	return message
}

const cctpMessageSnapshot = (
	messageId: CctpMessageId,
	result: MessagesV2Response,
	message: MessageV2,
	observedAtMs: number
) => {
	const decoded = message.decodedMessage
	const body = decoded?.decodedMessageBody
	const destinationDomain = optionalNumberFromWire(decoded?.destinationDomain)
	const sourceDomainFromWire = optionalNumberFromWire(decoded?.sourceDomain)
	const messageBytes = optionalZeroExHex(message.message)
	const attestation = optionalZeroExHex(message.attestation)
	const hookData = optionalZeroExHex(body?.hookData)
	const amount = optionalBigIntFromWire(body?.amount)
	const maxFee = optionalBigIntFromWire(body?.maxFee)
	const feeExecuted = optionalBigIntFromWire(body?.feeExecuted)
	const expirationBlock = optionalBigIntFromWire(body?.expirationBlock)
	const minFinalityThreshold = optionalNumberFromWire(decoded?.minFinalityThreshold)
	const finalityThresholdExecuted = optionalNumberFromWire(decoded?.finalityThresholdExecuted)
	const forwardTxHash = (
		message.forwardTxHash == null ?
			undefined
		:
			hexLowerOfByteSize(with0xHex(message.forwardTxHash), 32)
	)
	const sourceTransactionHash = hexLowerOfByteSize(with0xHex(result.sourceTxHash), 32)

	return {
		sourceDomain: messageId.sourceDomain,
		nonce: messageId.nonce,
		...(message.cctpVersion != null && {
			cctpVersion: message.cctpVersion,
		}),
		...(messageBytes != null && {
			messageBytes,
		}),
		...(sourceTransactionHash != null && {
			sourceTransactionHash,
		}),
		$sourceDomain: domainRef(sourceDomainFromWire ?? messageId.sourceDomain),
		...(destinationDomain != null && {
			destinationDomain,
			$destinationDomain: domainRef(destinationDomain),
		}),
		...(decoded?.sender != null && decoded.sender !== '' && {
			sender: decoded.sender,
		}),
		...(decoded?.recipient != null && decoded.recipient !== '' && {
			recipient: decoded.recipient,
		}),
		...(decoded?.destinationCaller != null && decoded.destinationCaller !== '' && {
			destinationCaller: decoded.destinationCaller,
		}),
		...(body?.burnToken != null && body.burnToken !== '' && {
			burnToken: body.burnToken,
		}),
		...(body?.mintRecipient != null && body.mintRecipient !== '' && {
			mintRecipient: body.mintRecipient,
		}),
		...(amount != null && {
			amount,
		}),
		...(body?.messageSender != null && body.messageSender !== '' && {
			messageSender: body.messageSender,
		}),
		...(maxFee != null && {
			maxFee,
		}),
		...(feeExecuted != null && {
			feeExecuted,
		}),
		...(expirationBlock != null && {
			expirationBlock,
		}),
		...(hookData != null && {
			hookData,
		}),
		...(minFinalityThreshold != null && {
			minFinalityThreshold,
		}),
		...(finalityThresholdExecuted != null && {
			finalityThresholdExecuted,
		}),
		$$attestationTimestamps: [{
			[EntityMetaKey.Selector]: {
				$message: messageId,
				timestampMs: observedAtMs,
				source: Source.CircleCctpIris,
			},
		}],
		attestationObservation: {
			$message: {
				[EntityMetaKey.Selector]: messageId,
			},
			timestampMs: observedAtMs,
			source: Source.CircleCctpIris,
			...(message.status != null && {
				status: message.status,
			}),
			...(attestation != null && {
				attestation,
			}),
			...(message.delayReason != null && {
				delayReason: message.delayReason,
			}),
			...(message.forwardState != null && message.forwardState !== '' && {
				forwardState: message.forwardState,
			}),
			...(forwardTxHash != null && {
				forwardTxHash,
			}),
		},
	}
}

const loadMessageForSelector = async (
	messageId: CctpMessageId
) => {
	const { getMessages } = await import('$/sources/CircleCctp/Rest/queries.ts')
	const result = await getMessages({
		sourceDomain: messageId.sourceDomain,
		subject: {
			nonce: messageId.nonce,
		},
	})
	if (result == null)
		throw new Error(`CircleCctpIris: message not found for ${messageId.sourceDomain}:${messageId.nonce}`)

	return {
		result,
		message: messageMatchingNonce(result, messageId.nonce),
	}
}

const burnFeeRowsFromWire = (
	rows: BurnFeeRow[]
) => (
	rows.map((row) => {
		const forwardFeeLow = optionalBigIntFromWire(row.forwardFee?.low)
		const forwardFeeMedium = optionalBigIntFromWire(row.forwardFee?.medium)
		const forwardFeeHigh = optionalBigIntFromWire(row.forwardFee?.high)
		return {
			finalityThreshold: row.finalityThreshold,
			minimumFeeBps: row.minimumFee,
			...(forwardFeeLow != null && {
				forwardFeeLow,
			}),
			...(forwardFeeMedium != null && {
				forwardFeeMedium,
			}),
			...(forwardFeeHigh != null && {
				forwardFeeHigh,
			}),
		}
	})
)

export default {
	source: Source.CircleCctpIris,

	resolvers: [
		defineResolver({
			entityType: EntityType.CctpMessage,
			resolve: {
				SourceDomainNonce: {
					resolve: async (messageId) => {
						if (!Number.isSafeInteger(messageId.sourceDomain) || messageId.sourceDomain < 0)
							throw new Error('CircleCctpIris: invalid source domain')
						if (messageId.nonce === '')
							throw new Error('CircleCctpIris: invalid nonce')

						const {
							result,
							message,
						} = await loadMessageForSelector(messageId)
						return cctpMessageSnapshot(
							messageId,
							result,
							message,
							Date.now()
						)
					},
				},
			},
		})({
			sourceDomain: (message) => message.sourceDomain,
			nonce: (message) => message.nonce,
			cctpVersion: (message) => message.cctpVersion,
			messageBytes: (message) => message.messageBytes,
			sourceTransactionHash: (message) => message.sourceTransactionHash,
			$sourceDomain: (message) => message.$sourceDomain,
			$destinationDomain: (message) => message.$destinationDomain,
			destinationDomain: (message) => message.destinationDomain,
			sender: (message) => message.sender,
			recipient: (message) => message.recipient,
			destinationCaller: (message) => message.destinationCaller,
			burnToken: (message) => message.burnToken,
			mintRecipient: (message) => message.mintRecipient,
			amount: (message) => message.amount,
			messageSender: (message) => message.messageSender,
			maxFee: (message) => message.maxFee,
			feeExecuted: (message) => message.feeExecuted,
			expirationBlock: (message) => message.expirationBlock,
			hookData: (message) => message.hookData,
			minFinalityThreshold: (message) => message.minFinalityThreshold,
			finalityThresholdExecuted: (message) => message.finalityThresholdExecuted,
			$$attestationTimestamps: (message) => message.$$attestationTimestamps,
		}),

		defineResolver({
			entityType: EntityType.CctpAttestation_Timestamp,
			resolve: {
				MessageTimestampMsSource: {
					resolve: async ({
						$message,
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'attestation')
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris: invalid attestation timestamp')

						const {
							result,
							message,
						} = await loadMessageForSelector($message)
						const snapshot = cctpMessageSnapshot(
							$message,
							result,
							message,
							timestampMs
						)
						return snapshot.attestationObservation
					},
				},
			},
		})({
			$message: (observation) => observation.$message,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			status: (observation) => observation.status,
			attestation: (observation) => observation.attestation,
			delayReason: (observation) => observation.delayReason,
			forwardState: (observation) => observation.forwardState,
			forwardTxHash: (observation) => observation.forwardTxHash,
		}),

		defineResolver({
			entityType: EntityType.CctpBurnFee_Timestamp,
			resolve: {
				SourceDomainDestinationDomainTimestampMsSource: {
					resolve: async ({
						$sourceDomain,
						$destinationDomain,
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'burn fee')
						assertDomainSelector($sourceDomain, 'source')
						assertDomainSelector($destinationDomain, 'destination')
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris: invalid burn fee timestamp')

						const { getBurnUsdcFees } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const feeRows = await getBurnUsdcFees({
							sourceDomain: $sourceDomain.domainId,
							destinationDomain: $destinationDomain.domainId,
							forward: true,
						})

						return {
							$sourceDomain: {
								[EntityMetaKey.Selector]: $sourceDomain,
							},
							$destinationDomain: {
								[EntityMetaKey.Selector]: $destinationDomain,
							},
							timestampMs,
							source,
							forward: true,
							feeRows: burnFeeRowsFromWire(feeRows),
						}
					},
				},
			},
		})({
			$sourceDomain: (observation) => observation.$sourceDomain,
			$destinationDomain: (observation) => observation.$destinationDomain,
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			forward: (observation) => observation.forward,
			feeRows: (observation) => observation.feeRows,
		}),

		defineResolver({
			entityType: EntityType.CctpFastBurnAllowance_Timestamp,
			resolve: {
				TimestampMsSource: {
					resolve: async ({
						timestampMs,
						source,
					}) => {
						assertIrisSource(source, 'fast burn allowance')
						if (!Number.isSafeInteger(timestampMs) || timestampMs < 0)
							throw new Error('CircleCctpIris: invalid fast burn allowance timestamp')

						const { getFastBurnUsdcAllowance } = await import('$/sources/CircleCctp/Rest/queries.ts')
						const allowance = await getFastBurnUsdcAllowance()
						const lastUpdatedMs = (
							allowance.lastUpdated == null || allowance.lastUpdated === '' ?
								undefined
							:
								Date.parse(allowance.lastUpdated)
						)
						if (allowance.lastUpdated != null && allowance.lastUpdated !== '' && !Number.isFinite(lastUpdatedMs))
							throw new Error(`CircleCctpIris: invalid lastUpdated ${allowance.lastUpdated}`)

						return {
							timestampMs,
							source,
							...(allowance.allowance != null && {
								allowanceUsdc: allowance.allowance,
							}),
							...(lastUpdatedMs != null && {
								lastUpdatedMs,
							}),
						}
					},
				},
			},
		})({
			timestampMs: (observation) => observation.timestampMs,
			source: (observation) => observation.source,
			allowanceUsdc: (observation) => observation.allowanceUsdc,
			lastUpdatedMs: (observation) => observation.lastUpdatedMs,
		}),
	],
} satisfies RegisteredSourceResolverModule
