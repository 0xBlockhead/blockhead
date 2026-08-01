<script lang="ts">
	import { goto } from '$app/navigation'
	import { resolve } from '$app/paths'
	import {
		deleteLocalBlockheadFarcasterAccountConnection,
		writeLocalBlockheadFarcasterAccountConnection,
	} from '$/collections/localMutations.ts'
	import { BlockheadFarcasterConnectionAuthMethod } from '$/schema/BlockheadFarcasterConnectionAuthMethod.ts'
	import { getAppClient } from '$/routes/+layout.svelte'

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
	const persisted = (): {
		connectionId: string
		fid: number
		signerAddress: string
		authMethod: BlockheadFarcasterConnectionAuthMethod
		verifiedAt: number
		expiresAt: number
		associationFingerprint: string
		selected: boolean
	}[] => JSON.parse(localStorage.getItem(storageKey) ?? '[]')

	const persist = (connections: ReturnType<typeof persisted>) => {
		localStorage.setItem(storageKey, JSON.stringify(connections))
		connections.forEach((connection) => writeLocalBlockheadFarcasterAccountConnection(getAppClient(), connection))
	}

	const connect = () => {
		error = ''
		if (!/^0x[0-9a-fA-F]{40}$/.test(signerAddress)) {
			error = 'Enter the address proven by the connected wallet.'
			return
		}
		error = 'A connected wallet with Farcaster custody or approved app auth-address proof is required.'
	}

	const update = (action: 'select' | 'reverify' | 'disconnect') => {
		if (connectionId == null) return
		const connections = persisted()
		if (action === 'disconnect') {
			deleteLocalBlockheadFarcasterAccountConnection(getAppClient(), connectionId)
			persist(connections.filter((connection) => connection.connectionId !== connectionId))
			status = 'Farcaster connection disconnected.'
			void goto(resolve('/farcaster/accounts'))
			return
		}
		if (action === 'reverify') {
			error = 'Reconnect the proving wallet to reverify this Farcaster association.'
			return
		}
		persist(connections.map((connection) => (
			connection.connectionId === connectionId ?
				{
					...connection,
					selected: true,
				}
			:
				{
					...connection,
					selected: false,
				}
		)))
		status = 'Farcaster viewer selected.'
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
	{:else if /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(connectionId)}
		<div data-row="start wrap gap-2">
			<button type="button" onclick={() => update('select')}>Select viewer</button>
			<button type="button" onclick={() => update('reverify')}>Reverify</button>
			<button type="button" onclick={() => update('disconnect')}>Disconnect</button>
		</div>
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
