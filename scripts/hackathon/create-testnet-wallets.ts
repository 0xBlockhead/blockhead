import { randomBytes } from 'node:crypto'
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { type } from 'arktype'
import * as Address from 'ox/Address'
import * as Mnemonic from 'ox/Mnemonic'


const createWallets = async () => {
	// Outside all Git worktrees. Exclusive directory creation prevents replacement
	// of existing wallets and refuses a pre-existing symlink at this location.
	const directory = join(homedir(), 'Developer', 'blockhead-2026-worktrees', '.ethonline-2026-testnet-wallets')
	await mkdir(directory, { mode: 0o700 })
	const wallets = []
	for (const role of ['ambire', 'ledger-speculos']) {
		const mnemonic = Mnemonic.random(Mnemonic.english, { strength: 256 })
		const derivationPath = Mnemonic.path()
		const address = Address.fromPublicKey(Mnemonic.toHdKey(mnemonic).derive(derivationPath).publicKey)
		const path = join(directory, `${role}.json`)
		await writeFile(path, JSON.stringify({
			purpose: 'ETHOnline 2026 testnet only; never use with real assets',
			mnemonic,
			password: randomBytes(24).toString('base64url'),
			derivationPath,
			address,
		}), { mode: 0o600, flag: 'wx' })
		const stored = type({
			mnemonic: 'string',
			derivationPath: 'string',
			address: 'string',
		}).assert(JSON.parse(await readFile(path, 'utf8')))
		if (
			!Mnemonic.validate(stored.mnemonic, Mnemonic.english)
			|| Address.fromPublicKey(Mnemonic.toHdKey(stored.mnemonic).derive(stored.derivationPath).publicKey) !== address
			|| stored.address !== address
			|| ((await stat(path)).mode & 0o777) !== 0o600
		)
			throw new Error('Wallet persistence verification failed')
		wallets.push({
			role,
			address,
			derivationPath,
			status: 'generated-and-restored; not yet imported or funded',
		})
	}
	console.log(JSON.stringify({
		purpose: 'testnet-only',
		secretDirectory: directory,
		wallets,
	}, null, 2))
}

await createWallets().catch(() => {
	// Never print exception payloads from mnemonic/derivation operations.
	console.error('Wallet creation failed. Existing files are preserved; no secret values were logged.')
	process.exitCode = 1
})
