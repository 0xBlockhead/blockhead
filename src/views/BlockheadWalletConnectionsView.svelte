<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { getWalletConnectionRuntime } from '$/state/wallets/walletConnectionRuntime.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		id,
		title = 'Wallet connections',
		open = $bindable(true),
	}: {
		id: string
		title?: string
		open?: boolean
	} = $props()


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import Icon from '$/components/Icon.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
</script>


<EntitiesList
	entityType={EntityType.BlockheadWalletConnection}
	{id}
	href={resolve('/~/accounts')}
	{title}
	bind:open
	placeholderText="Resolving wallet connections…"
>
	{#snippet TypeAnnotationTooltip()}
		<p>
			Wallet connections normalize injected providers, registry wallets, QR sessions, postMessage signers, P2P bridges, and hardware bridges into CAIP-scoped accounts.
		</p>
		<p>
			Discovery is separate from authorization: a wallet candidate can be visible before any account or signing scope is granted.
		</p>
		<p>
			Always confirm account, scope, and protocol before signing bridges or contract calls.
		</p>
	{/snippet}

	{#snippet body({ open: _bodyOpen })}
		{@const walletRuntime = getWalletConnectionRuntime()}
		<div data-column="gap-3">
			{#if walletRuntime?.connections.length}
				<div data-column="gap-2">
					{#each walletRuntime.connections.toSorted((connectionA, connectionB) => (
						connectionA.walletId.localeCompare(connectionB.walletId)
					)) as connection (connection.walletId)}
						<BlockheadWalletConnectionView
							selector={{
								$wallet: {
									id: connection.walletId,
								},
							}}
							onRemove={() => walletRuntime.disconnect(connection.walletId)}
							href={resolve('/~/accounts')}

						/>
					{/each}
				</div>
			{:else}
				<p data-text="muted">
					No wallet connections yet.
				</p>
			{/if}

			{#if walletRuntime}
				{@const availableCandidates = walletRuntime.candidates.filter((candidate) => (
					!walletRuntime.connections.some((connection) => connection.walletId === candidate.id)
				))}
				{#if availableCandidates.length}
					<div data-row="start">
						{#each availableCandidates as candidate (candidate.id)}
						<button
							type="button"
							data-row="align-center"
							onclick={() => walletRuntime?.connect(candidate.id)}
						>
							{#if candidate.icon}
								<Icon
									src={candidate.icon}
									alt={candidate.name}
								/>
							{/if}

							<span>
								Connect {candidate.name}
							</span>
						</button>
						{/each}
					</div>
				{/if}
			{/if}
		</div>
	{/snippet}
</EntitiesList>
