import { getJson } from '$/lib/http.ts'
import type {
	BcmrIdentitySnapshot,
	BcmrRegistry,
} from '$/sources/BitcoinCashBcmr/Github/types.ts'
import { githubHttpEndpoints } from '$/sources/_shared/hosts/Github/Http/constants.ts'

const origins = githubHttpEndpoints.map((endpoint) => ({
	origin: endpoint.origin,
	corsEnabled: endpoint.corsEnabled,
}))

const isIsoTimestamp = (value: string) => {
	const timestampMs = Date.parse(value)
	return !Number.isNaN(timestampMs) && new Date(timestampMs).toISOString() === value
}

export const getRegistry = ({ url }: { url: string }) => {
	const registryUrl = new URL(url)
	if (
		registryUrl.protocol !== 'https:'
		|| (
			registryUrl.hostname !== 'raw.githubusercontent.com'
			&& registryUrl.hostname !== 'api.github.com'
		)
	)
		throw new Error('BitcoinCashBcmr_Github: registry URL must use the declared GitHub source')
	return getJson<BcmrRegistry>(
		url,
		{ origins }
	)
}

export const getCategoryMetadata = async ({
	url,
	categoryId,
	atTimestamp = new Date().toISOString(),
}: {
	url: string
	categoryId: string
	atTimestamp?: string
}) => {
	if (!/^[0-9a-f]{64}$/.test(categoryId))
		throw new Error('BitcoinCashBcmr_Github: invalid CashToken category ID')
	if (!isIsoTimestamp(atTimestamp))
		throw new Error('BitcoinCashBcmr_Github: invalid metadata observation timestamp')
	const identity = (await getRegistry({ url })).identities?.[categoryId]
	if (identity == null)
		throw new Error(`BitcoinCashBcmr_Github: category not found ${categoryId}`)

	const revisions = Object.entries(identity)
		.map(([revision, snapshot]) => {
			if (!isIsoTimestamp(revision))
				throw new Error('BitcoinCashBcmr_Github: invalid identity revision timestamp')
			return [revision, snapshot] as const
		})
		.sort(([left], [right]) => left.localeCompare(right))
	if (revisions.length === 0)
		throw new Error(`BitcoinCashBcmr_Github: category has no revisions ${categoryId}`)
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
		snapshot: snapshot satisfies BcmrIdentitySnapshot,
	}
}
