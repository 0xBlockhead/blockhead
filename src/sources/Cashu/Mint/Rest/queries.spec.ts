import {
	beforeEach,
	expect,
	it,
	vi,
} from 'vitest'
const { bindings, sourceFetch } = vi.hoisted(() => ({
	bindings: {
		CashuMint_Rest: [
			{
				target: { key: 'https://first.mint' },
				endpoints: [{ locator: 'https://first.mint' }],
			},
			{
				target: { key: 'https://second.mint' },
				endpoints: [{ locator: 'https://second.mint/' }],
			},
		],
	},
	sourceFetch: vi.fn(),
}))
vi.mock('$/sources/Cashu/bindings.ts', () => ({ default: bindings }))
vi.mock('$/sources/_runtime/http.ts', () => ({
	firstHttpUrlForBinding: (binding: typeof bindings.CashuMint_Rest[number]) => binding.endpoints[0]?.locator,
	sourceFetch,
}))
const {
	CashuMintProtocolError,
	checkProofStates,
	createMeltQuoteBolt11,
	createMintQuoteBolt11,
	getMeltQuoteBolt11,
	getMintInfo,
	getMintKeysets,
	getMintKeys,
	getMintKeysForKeyset,
	getMintQuoteBolt11,
	meltBolt11,
	mintBolt11,
	restoreSignatures,
	swap,
} = await import('$/sources/Cashu/Mint/Rest/queries.ts')

const jsonResponse = (
	body: object,
	status = 200
) => new Response(JSON.stringify(body), {
	status,
	headers: {
		'content-type': 'application/json',
	},
})

beforeEach(() => {
	sourceFetch.mockReset()
})

it('dispatches each Cashu endpoint through its exact binding and preserves keyset URL encoding', async () => {
	sourceFetch
		.mockResolvedValueOnce(jsonResponse({
			name: 'First mint',
		}))
		.mockResolvedValueOnce(jsonResponse({
			keysets: [],
		}))
		.mockResolvedValueOnce(jsonResponse({
			keysets: [],
		}))
		.mockResolvedValueOnce(jsonResponse({
			keysets: [{
				id: 'keyset/with spaces',
				unit: 'sat',
				active: true,
				keys: {
					1: '02abc',
				},
			}],
		}))

	await expect(getMintInfo('https://first.mint')).resolves.toEqual({
		name: 'First mint',
	})
	await expect(getMintKeysets('https://second.mint')).resolves.toEqual({
		keysets: [],
	})
	await expect(getMintKeys('https://second.mint')).resolves.toEqual({
		keysets: [],
	})
	await expect(getMintKeysForKeyset('https://second.mint', {
		keysetId: 'keyset/with spaces',
	})).resolves.toEqual({
		keysets: [{
			id: 'keyset/with spaces',
			unit: 'sat',
			active: true,
			keys: {
				1: '02abc',
			},
		}],
	})

	expect(sourceFetch.mock.calls).toEqual([
		[
			bindings.CashuMint_Rest[0],
			'https://first.mint/v1/info',
			undefined,
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keysets',
			undefined,
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keys',
			undefined,
		],
		[
			bindings.CashuMint_Rest[1],
			'https://second.mint/v1/keys/keyset%2Fwith%20spaces',
			undefined,
		],
	])
})

it('fails closed on unsupported mint info responses', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({}))

	await expect(getMintInfo('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: unsupported mint info response for mint https://first.mint'
	)
})

it('fails closed on malformed mint keysets responses', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		keysets: [
			{
				id: 1,
				unit: 'sat',
				active: true,
			},
		],
	}))

	await expect(getMintKeysets('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: invalid mint keysets response envelope for mint https://first.mint'
	)
})

it('fails closed on malformed mint keys responses', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		keysets: [
			{
				id: 'keyset-id',
				unit: 'sat',
				active: true,
				keys: {
					1: 2,
				},
			},
		],
	}))

	await expect(getMintKeys('https://first.mint')).rejects.toThrow(
		'CashuMint_Rest: invalid mint keys response envelope for mint https://first.mint'
	)
})

it('rejects a keyset endpoint response that substitutes the requested identity', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		keysets: [{
			id: 'other-keyset',
			unit: 'sat',
			active: true,
			keys: {
				1: '02abc',
			},
		}],
	}))

	await expect(getMintKeysForKeyset('https://first.mint', {
		keysetId: 'requested-keyset',
	})).rejects.toThrow(
		'CashuMint_Rest: mint keys response is missing requested keyset requested-keyset'
	)
})

it('rejects mint and melt quote responses that substitute the requested identity', async () => {
	sourceFetch
		.mockResolvedValueOnce(jsonResponse({
			quote: 'other-mint-quote',
			request: 'lnbc-mint-invoice',
			amount: 1,
			unit: 'sat',
			method: 'bolt11',
			amount_paid: 0,
			amount_issued: 0,
			updated_at: 1,
			state: 'UNPAID',
			expiry: 2,
		}))
		.mockResolvedValueOnce(jsonResponse({
			quote: 'other-melt-quote',
			request: 'lnbc-melt-invoice',
			amount: 1,
			unit: 'sat',
			method: 'bolt11',
			fee_reserve: 0,
			state: 'UNPAID',
			expiry: 2,
		}))

	await expect(getMintQuoteBolt11(
		'https://first.mint',
		'requested-mint-quote'
	)).rejects.toThrow(
		'CashuMint_Rest: mint quote response does not match requested quote requested-mint-quote'
	)
	await expect(getMeltQuoteBolt11(
		'https://first.mint',
		'requested-melt-quote'
	)).rejects.toThrow(
		'CashuMint_Rest: melt quote response does not match requested quote requested-melt-quote'
	)
})

it('strips undeclared mint info keys at the read boundary', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		name: 'Mint',
		extra_freestyle: true,
	}))

	await expect(getMintInfo('https://first.mint')).resolves.toEqual({
		name: 'Mint',
	})
})

it('preserves source query rejections', async () => {
	sourceFetch.mockRejectedValueOnce(new Error('network down'))

	await expect(getMintKeysets('https://first.mint')).rejects.toThrow('network down')
})

it('owns the exact BOLT11, swap, state, and restore request surfaces', async () => {
	const requestSignal = new AbortController().signal
	const blindedMessage = {
		amount: 1,
		id: 'keyset-id',
		B_: 'blinded-message',
	}
	const proof = {
		amount: 1,
		id: 'keyset-id',
		secret: 'secret',
		C: 'signature',
	}
	const blindSignature = {
		amount: 1,
		id: 'keyset-id',
		C_: 'blind-signature',
	}
	const mintQuote = {
		quote: 'mint/quote',
		request: 'lnbc-mint-invoice',
		amount: 1,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 1,
		amount_issued: 0,
		updated_at: 1_700_000_000,
		state: 'PAID',
		expiry: 1_700_000_100,
	}
	const meltQuote = {
		quote: 'melt/quote',
		request: 'lnbc-melt-invoice',
		amount: 1,
		unit: 'sat',
		method: 'bolt11',
		fee_reserve: 0,
		state: 'PAID',
		expiry: 1_700_000_100,
		payment_preimage: 'preimage',
	}

	sourceFetch
		.mockResolvedValueOnce(jsonResponse(mintQuote))
		.mockResolvedValueOnce(jsonResponse(mintQuote))
		.mockResolvedValueOnce(jsonResponse({ signatures: [blindSignature] }))
		.mockResolvedValueOnce(jsonResponse({ signatures: [blindSignature] }))
		.mockResolvedValueOnce(jsonResponse(meltQuote))
		.mockResolvedValueOnce(jsonResponse(meltQuote))
		.mockResolvedValueOnce(jsonResponse(meltQuote))
		.mockResolvedValueOnce(jsonResponse({
			states: [
				{
					Y: 'proof-y',
					state: 'SPENT',
					witness: null,
				},
			],
		}))
		.mockResolvedValueOnce(jsonResponse({
			outputs: [blindedMessage],
			signatures: [blindSignature],
		}))

	await expect(createMintQuoteBolt11('https://first.mint', {
		amount: 1,
		unit: 'sat',
		description: 'test invoice',
	}, { signal: requestSignal })).resolves.toEqual(mintQuote)
	await expect(getMintQuoteBolt11(
		'https://first.mint',
		'mint/quote',
		{ signal: requestSignal }
	)).resolves.toEqual(mintQuote)
	await expect(mintBolt11('https://first.mint', {
		quote: 'mint-quote',
		outputs: [blindedMessage],
	}, { signal: requestSignal })).resolves.toEqual({ signatures: [blindSignature] })
	await expect(swap('https://first.mint', {
		inputs: [proof],
		outputs: [blindedMessage],
	}, { signal: requestSignal })).resolves.toEqual({ signatures: [blindSignature] })
	await expect(createMeltQuoteBolt11('https://first.mint', {
		request: 'lnbc-melt-invoice',
		unit: 'sat',
		options: {
			amountless: {
				amount_msat: 1_000,
			},
		},
	}, { signal: requestSignal })).resolves.toEqual(meltQuote)
	await expect(getMeltQuoteBolt11(
		'https://first.mint',
		'melt/quote',
		{ signal: requestSignal }
	)).resolves.toEqual(meltQuote)
	await expect(meltBolt11('https://first.mint', {
		quote: 'melt-quote',
		inputs: [proof],
		outputs: [blindedMessage],
		prefer_async: true,
	}, { signal: requestSignal })).resolves.toEqual(meltQuote)
	await expect(checkProofStates('https://first.mint', {
		Ys: ['proof-y'],
	}, { signal: requestSignal })).resolves.toEqual({
		states: [
			{
				Y: 'proof-y',
				state: 'SPENT',
				witness: null,
			},
		],
	})
	await expect(restoreSignatures('https://first.mint', {
		outputs: [blindedMessage],
	}, { signal: requestSignal })).resolves.toEqual({
		outputs: [blindedMessage],
		signatures: [blindSignature],
	})

	expect(sourceFetch.mock.calls.map(([, url, init]) => ({
		url,
		method: init?.method,
		body: init?.body,
		signal: init?.signal,
	}))).toEqual([
		{
			url: 'https://first.mint/v1/mint/quote/bolt11',
			method: 'POST',
			body: JSON.stringify({
				amount: 1,
				unit: 'sat',
				description: 'test invoice',
			}),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/mint/quote/bolt11/mint%2Fquote',
			method: undefined,
			body: undefined,
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/mint/bolt11',
			method: 'POST',
			body: JSON.stringify({
				quote: 'mint-quote',
				outputs: [blindedMessage],
			}),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/swap',
			method: 'POST',
			body: JSON.stringify({
				inputs: [proof],
				outputs: [blindedMessage],
			}),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/melt/quote/bolt11',
			method: 'POST',
			body: JSON.stringify({
				request: 'lnbc-melt-invoice',
				unit: 'sat',
				options: {
					amountless: {
						amount_msat: 1_000,
					},
				},
			}),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/melt/quote/bolt11/melt%2Fquote',
			method: undefined,
			body: undefined,
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/melt/bolt11',
			method: 'POST',
			body: JSON.stringify({
				quote: 'melt-quote',
				inputs: [proof],
				outputs: [blindedMessage],
				prefer_async: true,
			}),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/checkstate',
			method: 'POST',
			body: JSON.stringify({ Ys: ['proof-y'] }),
			signal: requestSignal,
		},
		{
			url: 'https://first.mint/v1/restore',
			method: 'POST',
			body: JSON.stringify({ outputs: [blindedMessage] }),
			signal: requestSignal,
		},
	])
})

it('rejects malformed operation requests and responses at the Cashu boundary', async () => {
	await expect(createMintQuoteBolt11('https://first.mint', {
		amount: -1,
		unit: 'sat',
	})).rejects.toThrow()
	expect(sourceFetch).not.toHaveBeenCalled()

	sourceFetch.mockResolvedValueOnce(jsonResponse({
		quote: 'mint-quote',
		request: 'invoice',
		amount: 1,
		unit: 'sat',
		method: 'bolt11',
		amount_paid: 1,
		amount_issued: 0,
		expiry: null,
	}))

	await expect(createMintQuoteBolt11('https://first.mint', {
		amount: 1,
		unit: 'sat',
	})).rejects.toThrow(
		'CashuMint_Rest: invalid mint quote response envelope for mint https://first.mint'
	)
})

it('preserves typed NUT-00 protocol failures', async () => {
	sourceFetch.mockResolvedValueOnce(jsonResponse({
		detail: 'quote expired',
		code: 10_002,
	}, 400))

	const request = getMintQuoteBolt11('https://first.mint', 'expired-quote')

	await expect(request).rejects.toBeInstanceOf(CashuMintProtocolError)
	await expect(request).rejects.toMatchObject({
		mintUrl: 'https://first.mint',
		status: 400,
		code: 10_002,
		detail: 'quote expired',
	})
})
