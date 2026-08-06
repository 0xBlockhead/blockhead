import { sourceGetJson } from '$/sources/_runtime/http.ts'
import bindings from '$/sources/BitcoinCashBcmr/bindings.ts'
import {
	bcmrIdentitySnapshot,
	bcmrRegistry,
	type BcmrRegistry,
} from '$/sources/BitcoinCashBcmr/Github/types.ts'
import { Source } from '$/sources/Source.ts'

const isIsoTimestamp = (value: string) => {
	const timestampMs = Date.parse(value)
	return !Number.isNaN(timestampMs) && new Date(timestampMs).toISOString() === value
}

const assertEnvelope = <_Value>(
	label: string,
	wire: { assert: (value: unknown) => _Value },
	response: unknown
) => {
	try {
		return wire.assert(response)
	} catch {
		throw new Error(`${Source.BitcoinCashBcmr_Github}: invalid ${label} response envelope`)
	}
}

export const getRegistry = async (
	{ url }: { url: string }
) => {
	const registryUrl = new URL(url)
	if (
		registryUrl.protocol !== 'https:'
		|| (
			registryUrl.hostname !== 'raw.githubusercontent.com'
			&& registryUrl.hostname !== 'api.github.com'
		)
	)
		throw new Error('BitcoinCashBcmr_Github: registry URL must use the declared GitHub source')
	const registry = assertEnvelope(
		'registry',
		bcmrRegistry,
		await sourceGetJson<unknown>(bindings[Source.BitcoinCashBcmr_Github][0], url)
	)
	return {
		...registry,
		...(registry.identities != null && {
			identities: Object.fromEntries(
				Object.entries(registry.identities).map(([categoryId, identity]) => [
					categoryId,
					Object.fromEntries(
						Object.entries(identity).map(([revision, snapshot]) => [
							revision,
							assertEnvelope(
								`identity snapshot ${categoryId}@${revision}`,
								bcmrIdentitySnapshot,
								snapshot
							),
						])
					),
				])
			),
		}),
	} as BcmrRegistry
}

export const getCategoryMetadata = async (
	{
		url,
		categoryId,
		atTimestamp = new Date().toISOString(),
	}: {
		url: string
		categoryId: string
		atTimestamp?: string
	}
) => {
	if (!/^[0-9a-f]{64}$/.test(categoryId))
		throw new Error('BitcoinCashBcmr_Github: invalid CashToken category ID')
	if (!isIsoTimestamp(atTimestamp))
		throw new Error('BitcoinCashBcmr_Github: invalid metadata observation timestamp')
	const identity = (await getRegistry({ url })).identities?.[categoryId]
	if (identity == null)
		throw new Error(`BitcoinCashBcmr_Github: category not found ${categoryId}`)

	const revisions = Object.entries(identity)
		.sort(([left], [right]) => left.localeCompare(right))
	if (revisions.length === 0)
		throw new Error(`BitcoinCashBcmr_Github: category has no revisions ${categoryId}`)
	if (revisions.some(([revision]) => !isIsoTimestamp(revision)))
		throw new Error('BitcoinCashBcmr_Github: invalid identity revision timestamp')
	const [revision, snapshot] = (
		revisions.filter(([candidate]) => candidate <= atTimestamp).at(-1)
		?? revisions[0]
	)
	if (snapshot.token?.category != null && snapshot.token.category !== categoryId)
		throw new Error('BitcoinCashBcmr_Github: snapshot token category does not match registry identity')
	if (
		snapshot.token?.decimals != null
		&& (!Number.isSafeInteger(snapshot.token.decimals) || snapshot.token.decimals < 0)
	)
		throw new Error('BitcoinCashBcmr_Github: invalid token decimals')
	return {
		revision,
		snapshot,
	}
}
