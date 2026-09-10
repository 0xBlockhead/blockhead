import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'
import { SourceDelivery } from '$/sources/SourceBinding.ts'

const { corsFetch } = vi.hoisted(() => ({ corsFetch: vi.fn() }))
vi.mock('$/lib/http.ts', async (importOriginal) => ({
	...await importOriginal<typeof import('$/lib/http.ts')>(),
	corsFetch,
}))

const {
	getCurrentPdsOrigin,
	parseAtprotoDidDocument,
} = await import('$/sources/AtprotoSync/Xrpc/identity.ts')

const plcDid = 'did:plc:ewvi7nxzyoun6zhxrhs64oiz'
const webDid = 'did:web:identity.example.com'
const pdsOrigin = 'https://pds.example.com'
const documentFor = (did: string) => ({
	id: did,
	service: [{
		id: '#atproto_pds',
		type: 'AtprotoPersonalDataServer',
		serviceEndpoint: pdsOrigin,
	}],
})

describe('ATProto DID identity through production source bindings', () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	beforeEach(() => {
		corsFetch.mockReset()
	})

	it.each([
		[plcDid, 'https://plc.directory/did%3Aplc%3Aewvi7nxzyoun6zhxrhs64oiz'],
		[webDid, 'https://identity.example.com/.well-known/did.json'],
	])('resolves %s using the native source declaration', async (did, url) => {
		const signal = new AbortController().signal
		corsFetch.mockResolvedValueOnce(Response.json(documentFor(did)))
		await expect(getCurrentPdsOrigin({ did, signal })).resolves.toBe(pdsOrigin)
		expect(corsFetch).toHaveBeenCalledExactlyOnceWith(url, expect.objectContaining({
			init: { signal, redirect: 'error' },
			delivery: SourceDelivery.RemoteQuery,
			origins: [{ origin: new URL(url).origin, corsEnabled: false }],
		}))
	})

	it('rejects browser-side identity I/O before transport', async () => {
		vi.stubGlobal('window', {})
		await expect(getCurrentPdsOrigin({ did: plcDid })).rejects.toThrow('must run through a SvelteKit query')
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it.each([
		'did:key:zExample',
		'did:plc:example',
		'did:web:',
		'did:web:127.0.0.1',
		'did:web:identity.example.com:users:alice',
		'did:web:identity.example.com:%2Fprivate',
		'did:web:identity.example.com%3A443',
		'did:web:identity.arpa',
		'did:web:Identity.example.com',
	])('rejects unsupported or malformed %s before I/O', async (did) => {
		await expect(getCurrentPdsOrigin({ did })).rejects.toThrow(/unsupported DID method|malformed/)
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('rejects cancellation before looking up a binding or making a request', async () => {
		const controller = new AbortController()
		controller.abort(new Error('cancel identity'))
		await expect(getCurrentPdsOrigin({ did: plcDid, signal: controller.signal })).rejects.toBe(controller.signal.reason)
		expect(corsFetch).not.toHaveBeenCalled()
	})

	it('propagates source transport failure', async () => {
		const failure = new Error('identity transport failed')
		corsFetch.mockRejectedValueOnce(failure)
		await expect(getCurrentPdsOrigin({ did: plcDid })).rejects.toBe(failure)
	})

	it.each(['#atproto_pds', `${plcDid}#atproto_pds`])('accepts PDS service identity %s', (id) => {
		expect(parseAtprotoDidDocument({
			did: plcDid,
			document: {
				id: plcDid,
				service: [
					{ id: '#other', type: 'AtprotoPersonalDataServer', serviceEndpoint: 'https://wrong.example.com' },
					{ id, type: 'AtprotoPersonalDataServer', serviceEndpoint: pdsOrigin },
				],
			},
		})).toBe(pdsOrigin)
	})

	it('ignores unrelated structured services and rejects a structured PDS endpoint', () => {
		const service = [
			{ id: '#other', type: ['OtherService'], serviceEndpoint: { uri: 'https://other.example.com' } },
			...documentFor(plcDid).service,
		]
		expect(parseAtprotoDidDocument({ did: plcDid, document: { id: plcDid, service } })).toBe(pdsOrigin)
		expect(() => parseAtprotoDidDocument({
			did: plcDid,
			document: {
				id: plcDid,
				service: [{ id: '#atproto_pds', type: 'AtprotoPersonalDataServer', serviceEndpoint: { uri: pdsOrigin } }],
			},
		})).toThrow('malformed PDS service endpoint')
	})

	it.each([
		[{ id: plcDid }, 'malformed DID document'],
		[{ ...documentFor(plcDid), id: webDid }, 'does not match'],
		[{ id: plcDid, service: [] }, 'no AtprotoPersonalDataServer'],
		[{ id: plcDid, service: [{ id: '#other', type: 'AtprotoPersonalDataServer', serviceEndpoint: pdsOrigin }] }, 'no AtprotoPersonalDataServer'],
	])('rejects invalid DID document %#', (document, message) => {
		expect(() => parseAtprotoDidDocument({ did: plcDid, document })).toThrow(message)
	})

	it.each(['http://pds.example.com', 'https://127.0.0.1', 'https://[fc00::1]', 'https://localhost', 'https://pds.example.com/path'])('rejects invalid PDS origin %s', (serviceEndpoint) => {
		expect(() => parseAtprotoDidDocument({
			did: plcDid,
			document: {
				id: plcDid,
				service: [{ id: '#atproto_pds', type: 'AtprotoPersonalDataServer', serviceEndpoint }],
			},
		})).toThrow('invalid public HTTPS service origin')
	})

	it('accepts a public hostname beginning with an IPv6 private prefix', () => {
		expect(parseAtprotoDidDocument({
			did: plcDid,
			document: {
				id: plcDid,
				service: [{ id: '#atproto_pds', type: 'AtprotoPersonalDataServer', serviceEndpoint: 'https://fda.example.com' }],
			},
		})).toBe('https://fda.example.com')
	})
})
