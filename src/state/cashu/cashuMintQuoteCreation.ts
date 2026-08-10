import {
	type LocalMutationContext,
	writeLocalBlockheadCashuMintQuote,
} from '$/collections/localMutations.ts'
import type {
	CashuMintQuoteBolt11RequestWire,
	CashuMintQuoteBolt11Wire,
} from '$/sources/Cashu/Mint/Rest/types.ts'
import { Source } from '$/sources/Source.ts'


const admitLocalCashuMintQuoteBolt11 = (
	context: LocalMutationContext,
	mintUrl: string,
	quote: CashuMintQuoteBolt11Wire
) => writeLocalBlockheadCashuMintQuote(
	context,
	{
		mintUrl,
		method: quote.method,
		quoteId: quote.quote,
		request: quote.request,
		amount: BigInt(quote.amount),
		unit: quote.unit,
	},
	quote.state === undefined ? undefined : {
		timestampMs: quote.updated_at * 1000,
		source: Source.CashuMint_Rest,
		state: quote.state,
		...(quote.expiry !== null && {
			expiryMs: quote.expiry * 1000,
		}),
	}
)

export const createLocalCashuMintQuoteBolt11 = async (
	context: LocalMutationContext,
	{
		mintUrl,
		signal,
		...request
	}: CashuMintQuoteBolt11RequestWire & {
		mintUrl: string
		signal?: AbortSignal
	}
) => {
	const { createMintQuoteBolt11 } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
	const quote = await createMintQuoteBolt11(
		mintUrl,
		request,
		{ signal }
	)
	if (quote.amount !== request.amount || quote.unit !== request.unit)
		throw new Error('Cashu mint quote does not match the requested amount and unit')

	return admitLocalCashuMintQuoteBolt11(context, mintUrl, quote)
}

export const refreshLocalCashuMintQuoteBolt11 = async (
	context: LocalMutationContext,
	{
		mintUrl,
		quoteId,
		signal,
	}: {
		mintUrl: string
		quoteId: string
		signal?: AbortSignal
	}
) => {
	const { getMintQuoteBolt11 } = await import('$/sources/Cashu/Mint/Rest/queries.ts')
	const quote = await getMintQuoteBolt11(
		mintUrl,
		quoteId,
		{ signal }
	)
	if (quote.quote !== quoteId)
		throw new Error(`Cashu mint quote identity mismatch ${quote.quote} !== ${quoteId}`)

	return admitLocalCashuMintQuoteBolt11(context, mintUrl, quote)
}
