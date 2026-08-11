<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	import {
		evmAddressEntityKinds,
		evmAccountCandidatesFromSearchInput,
		evmHashEntityKinds,
		evmNetworkChoices,
		nostrHexEntityKinds,
		utxoTransactionNetworkChoices,
	} from './entitySearch.ts'

	let {
		data,
	}: {
		data: {
			query: string
		}
	} = $props()

	const evmAccountCandidates = $derived(
		evmAccountCandidatesFromSearchInput(data.query)
	)
	const isEvmHash = $derived(
		/^0x[a-fA-F0-9]{64}$/.test(data.query)
	)
	const isUtxoTransactionId = $derived(
		/^[a-fA-F0-9]{64}$/.test(data.query)
	)
</script>


<svelte:head>
	<title>Open an entity • Blockhead</title>
</svelte:head>


<main
	id="main"
	data-page="centered"
	data-column="gap-4"
>
	<header data-column="gap-1">
		<h1>Open an entity</h1>

		{#if evmAccountCandidates.length}
			<p role="status">
				“{data.query}” is a valid EVM address, but an address does not identify its network or entity kind.
			</p>
		{:else if isEvmHash}
			<p role="status">
				“{data.query}” is a valid 32-byte EVM hash, but a hash does not identify its network or entity kind.
			</p>
		{:else if isUtxoTransactionId}
			<p role="status">
				“{data.query}” is a valid 32-byte hexadecimal identifier, but it does not identify its network, protocol, or entity kind.
			</p>
		{:else if data.query}
			<p role="alert">
				“{data.query}” is unsupported. Include a canonical namespace or use a supported identifier.
			</p>
		{:else}
			<p>Enter a canonical identifier.</p>
		{/if}
	</header>

	<form
		action={resolve('/open')}
		method="get"
		data-column="gap-2"
	>
		<label for="open-entity-query">Identifier</label>

		<input
			id="open-entity-query"
			name="q"
			type="search"
			value={data.query}
			placeholder="eip155:1:0x…"
			autocomplete="off"
			enterkeyhint="go"
			required
			aria-describedby="open-entity-help"
		/>

		<p id="open-entity-help">
			Supported identifiers: CAIP-2 networks, CAIP-10 accounts, HTTP(S), YouTube and Farcaster content URLs, .eth names, @user@host ActivityPub handles, AT Protocol PLC DIDs and post URIs, Radicle RIDs, Arweave, IPFS/IPNS and Swarm URIs, and magnet URIs.
		</p>

		<button type="submit">Open entity</button>
	</form>

	{#if evmAccountCandidates.length || isEvmHash || isUtxoTransactionId}
		<aside
			aria-label="Candidate provenance"
			data-card="padding-2"
			data-column="gap-1"
		>
			<p>
				<strong>Candidate authority:</strong>
				Network identities and environments come from Blockhead’s checked-in network catalog; entity kinds correspond to existing generated routes.
			</p>

			<p>
				A candidate route identifies the entity coordinates; it does not claim that a configured provider supports or will resolve them.
			</p>
		</aside>
	{/if}

	{#if evmAccountCandidates.length}
		<section data-column="gap-2">
			<h2>Identify this EVM address</h2>

			<p>An address may identify an account or contract on any checked-in EVM network. Choose both coordinates to continue.</p>

			<form
				action={resolve('/open')}
				method="get"
				data-column="gap-2"
			>
				<input name="q" type="hidden" value={data.query} />

				<label for="evm-address-network">Network</label>

				<select id="evm-address-network" name="network" required>
					<option value="">Choose a network</option>
					{#each evmAccountCandidates as network (network.caip2)}
						<option value={network.caip2}>{network.name} — {network.environment} ({network.caip2})</option>
					{/each}
				</select>

				<label for="evm-address-kind">Entity kind</label>

				<select id="evm-address-kind" name="kind" required>
					<option value="">Choose an entity kind</option>
					{#each evmAddressEntityKinds as entityKind (entityKind.value)}
						<option value={entityKind.value}>{entityKind.label}</option>
					{/each}
				</select>

				<button type="submit">Open address</button>
			</form>
		</section>
	{/if}

	{#if isEvmHash}
		<section data-column="gap-2">
			<h2>Identify this EVM hash</h2>

			<p>A 32-byte hash does not identify its network or entity kind. Choose both coordinates to continue.</p>

			<form
				action={resolve('/open')}
				method="get"
				data-column="gap-2"
			>
				<input name="q" type="hidden" value={data.query} />

				<label for="evm-hash-network">Network</label>

				<select id="evm-hash-network" name="network" required>
					<option value="">Choose a network</option>
					{#each evmNetworkChoices as network (network.caip2)}
						<option value={network.caip2}>{network.name} — {network.environment} ({network.caip2})</option>
					{/each}
				</select>

				<label for="evm-hash-kind">Entity kind</label>

				<select id="evm-hash-kind" name="kind" required>
					<option value="">Choose an entity kind</option>
					{#each evmHashEntityKinds as entityKind (entityKind.value)}
						<option value={entityKind.value}>{entityKind.label}</option>
					{/each}
				</select>

				<button type="submit">Open hash</button>
			</form>
		</section>
	{/if}

	{#if isUtxoTransactionId}
		<section data-column="gap-2">
			<h2>Identify this transaction</h2>

			<p>The same transaction-ID shape is used by multiple checked-in networks. Choose the network coordinate to continue.</p>

			<form
				action={resolve('/open')}
				method="get"
				data-column="gap-2"
			>
				<input name="q" type="hidden" value={data.query} />

				<label for="utxo-transaction-network">Network</label>

				<select id="utxo-transaction-network" name="network" required>
					<option value="">Choose a network</option>
					{#each utxoTransactionNetworkChoices as network (network.network)}
						<option value={network.network}>{network.name} — {network.environment} ({network.identity})</option>
					{/each}
				</select>

				<button type="submit">Open transaction</button>
			</form>
		</section>

		<section data-column="gap-2">
			<h2>Identify this Nostr value</h2>

			<p>A Nostr public key and event ID have the same hexadecimal shape. Choose the entity kind to continue on the global Nostr network.</p>

			<form
				action={resolve('/open')}
				method="get"
				data-column="gap-2"
			>
				<input name="q" type="hidden" value={data.query} />

				<label for="nostr-hex-kind">Nostr entity kind</label>

				<select id="nostr-hex-kind" name="kind" required>
					<option value="">Choose an entity kind</option>
					{#each nostrHexEntityKinds as entityKind (entityKind.value)}
						<option value={entityKind.value}>{entityKind.label}</option>
					{/each}
				</select>

				<button type="submit">Open Nostr entity</button>
			</form>
		</section>
	{/if}
</main>
