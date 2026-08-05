import { expect, test } from './wallet.fixture.ts'


test.skip(process.env.WALLET_EXTENSIONS_E2E !== '1', 'Real wallet extension tests are opt-in')

test('loads every required real wallet artifact', async ({ extensions }) => {
	if (!process.env.WALLET_EXTENSION_DIRS)
		throw new Error('Real-wallet proof requires WALLET_EXTENSION_DIRS containing checksum-pinned unpacked wallet directories.')

	expect(extensions.map(({ kind }) => kind)).not.toContain('harness-only')
	expect(extensions.map(({ kind }) => kind)).not.toContain('unknown')
	if (process.env.WALLET_EXTENSION_EXPECTED_KINDS)
		expect(extensions.map(({ kind }) => kind)).toEqual(expect.arrayContaining(
			process.env.WALLET_EXTENSION_EXPECTED_KINDS.split(',')
		))
})
