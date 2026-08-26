<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import {
		deleteLocalBlockheadFarcasterAccountConnection,
		writeLocalBlockheadFarcasterAccountConnection,
	} from '$/collections/localMutations.ts'
	import { getAppClient } from '$/routes/applicationClient.ts'
	import {
		applyFarcasterAccountConnectionSelection,
		farcasterAccountConnectionFromPersisted,
		isCurrentFarcasterAccountConnection,
		persistFarcasterAccountConnection,
		type PersistedFarcasterAccountConnection,
	} from '$/state/farcaster/farcasterAccountConnectionState.ts'
	import { isSelectedWalletConnection } from '$/state/wallets/walletConnectionState.ts'
	import { getWalletConnectionRuntime } from '$/state/wallets/walletConnectionRuntime.svelte.ts'

	let {
		connectionId,
	}: {
		connectionId?: string
	} = $props()

	let fid = $state(3)
	let signerAddress = $state('')
	let status = $state('')
	let error = $state('')

	const storageKey = 'blockhead:farcaster-account-connections'
	const walletRuntime = $derived(getWalletConnectionRuntime())
	const selectedEvmWallet = $derived(
		walletRuntime?.connections.find((connection) => (
			isSelectedWalletConnection(connection)
			&& (connection.activeAccount ?? connection.accounts.at(0))?.namespace === 'eip155'
		))
	)

	const readPersisted = (): PersistedFarcasterAccountConnection[] => (
		JSON.parse(localStorage.getItem(storageKey) ?? '[]')
	)

	const hydrate = (
		rows: PersistedFarcasterAccountConnection[],
		now = Date.now()
	) => (
		rows.flatMap((row) => {
			const connection = farcasterAccountConnectionFromPersisted(row, now)
			return connection == null ? [] : [connection]
		})
	)

	const persist = (
		connections: ReturnType<typeof hydrate>
	) => {
		const previous = readPersisted()
		const rows = connections.map(persistFarcasterAccountConnection)
		localStorage.setItem(storageKey, JSON.stringify(rows))
		const liveIds = new Set(rows.map((row) => row.connectionId))
		for (const row of previous) {
			if (!liveIds.has(row.connectionId))
				deleteLocalBlockheadFarcasterAccountConnection(getAppClient(), row.connectionId)
		}
		rows.forEach((row) => writeLocalBlockheadFarcasterAccountConnection(getAppClient(), row))
	}

	const connect = () => {
		error = ''
		status = ''
		if (!/^0x[0-9a-fA-F]{40}$/.test(signerAddress)) {
			error = 'Enter the address proven by the connected wallet.'
			return
		}
		if (selectedEvmWallet == null) {
			error = 'Select an EVM wallet account first, then return here to verify the Farcaster association.'
			return
		}
		const account = selectedEvmWallet.activeAccount ?? selectedEvmWallet.accounts.at(0)
		if (account == null || account.accountAddress.toLowerCase() !== signerAddress.toLowerCase()) {
			error = 'The selected wallet account must match the Farcaster signer address.'
			return
		}
		error = 'A custody or approved app auth-address proof from Neynar/Snapchain is still required before this connection can be verified.'
	}

	const update = (action: 'select' | 'reverify' | 'disconnect') => {
		if (connectionId == null) return
		error = ''
		status = ''
		const now = Date.now()
		const connections = hydrate(readPersisted(), now)

		if (action === 'disconnect') {
			deleteLocalBlockheadFarcasterAccountConnection(getAppClient(), connectionId)
			persist(connections.filter((connection) => connection.connectionId !== connectionId))
			status = 'Farcaster connection disconnected.'
			void goto(resolve('/(social)/(farcaster)/farcaster/(farcasterNetwork)/accounts'))
			return
		}
		if (action === 'reverify') {
			error = 'Reconnect the proving wallet to reverify this Farcaster association.'
			return
		}

		const target = connections.find((connection) => connection.connectionId === connectionId)
		if (target == null || !isCurrentFarcasterAccountConnection(target, now)) {
			error = 'This Farcaster connection is missing or expired. Verify again with a connected wallet.'
			persist(connections)
			return
		}

		const selected = applyFarcasterAccountConnectionSelection(connections, connectionId, now)
		if (!selected.selected || selected.viewer == null) {
			error = 'Could not select this Farcaster connection as viewer.'
			return
		}
		persist(selected.connections)
		status = `Farcaster viewer selected for FID ${selected.viewer.fid}.`
	}
</script>


<section data-card data-column="gap-3" aria-labelledby="farcaster-account-control-title">
	<header>
		<h2 id="farcaster-account-control-title">Farcaster account control</h2>
	</header>

	{#if connectionId == null}
		<form
			data-column="gap-2"
			onsubmit={(event) => {
				event.preventDefault()
				connect()
			}}
		>
			<label for="farcaster-fid">FID</label>
			<input id="farcaster-fid" type="number" min="0" bind:value={fid} required />

			<label for="farcaster-signer">Connected wallet address</label>
			<input id="farcaster-signer" bind:value={signerAddress} autocomplete="off" required />

			<button type="submit">Verify and connect</button>
		</form>

		<p data-text="muted">
			{#if selectedEvmWallet == null}
				<a href={resolve('/~/wallets')}>Open wallets</a> and select an EVM account before verifying.
			{:else}
				Selected wallet ready for proof. Custody or approved auth-address evidence is still required to finish connect.
			{/if}
		</p>
	{:else if /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(connectionId)}
		{@const connection = hydrate(readPersisted()).find((row) => row.connectionId === connectionId)}
		<div data-row="start wrap gap-2">
			<button type="button" onclick={() => update('select')}>Select viewer</button>
			<button type="button" onclick={() => update('reverify')}>Reverify</button>
			<button type="button" onclick={() => update('disconnect')}>Disconnect</button>
		</div>
		{#if connection != null}
			<p data-text="muted">
				Role: {connection.role === 'viewer' ? 'Viewer' : 'Standby'}
				· FID {connection.fid}
			</p>
			{#if connection.role === 'viewer'}
				<p>
					<a
						href={resolve(
							'/(social)/(farcaster)/farcaster/(farcasterNetwork)/feed/following/[userId=farcasterFid]',
							{
								userId: String(connection.fid),
							}
						)}
					>
						Open following feed as viewer
					</a>
				</p>
			{/if}
		{:else}
			<p role="alert">This saved connection is missing or expired.</p>
		{/if}
	{:else}
		<p role="alert">Farcaster account connections require an opaque local connection ID.</p>
	{/if}

	{#if status}
		<p role="status">{status}</p>
	{/if}
	{#if error}
		<p role="alert">{error}</p>
	{/if}
</section>
