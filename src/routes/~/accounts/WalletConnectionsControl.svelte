<script lang="ts">
	// Types/constants
	import { WalletCapability } from '$/constants/Wallet.ts'
	import { BlockheadConnectionStatus } from '$/schema/BlockheadWalletConnection.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { getWalletConnectionRuntime } from '$/state/wallets/walletConnectionRuntime.svelte.ts'


	// State
	let {
		id,
	}: {
		id: string
	} = $props()

	const walletRuntime = $derived(getWalletConnectionRuntime())
	const availableCandidates = $derived(walletRuntime?.candidates.filter((candidate) => (
		!walletRuntime.connections.some((connection) => connection.walletId === candidate.id)
	)) ?? [])


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import Icon from '$/components/Icon.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<article
	{id}
	data-column-item="flexible"
	data-card
	data-scroll-container
>
	<header>
		<h2>Wallet connection status</h2>
	</header>

	<output aria-live="polite">
		{walletRuntime == null ?
			'Wallet discovery inactive.'
		:
			`Wallet discovery active. Active connections: ${walletRuntime.connections.filter((connection) => connection.status === BlockheadConnectionStatus.Connected).length}. Saved connections: ${walletRuntime.connections.length}. Providers detected: ${walletRuntime.candidates.length}.`}
	</output>
</article>

{#if walletRuntime}
	{#if walletRuntime.connections.length > 0}
		{#each walletRuntime.connections.toSorted((connectionA, connectionB) => (
			(connectionA.connectionKey ?? connectionA.walletId).localeCompare(connectionB.connectionKey ?? connectionB.walletId)
		)) as connection (connection.connectionKey ?? connection.walletId)}
			{@const connectionKey = connection.connectionKey ?? connection.walletId}
			{@const candidate = walletRuntime.candidates.find((candidate) => candidate.id === connection.walletId)}
			{@const connectionSelection = select(EntityType.BlockheadWalletConnection, {
				connectionKey,
			})}
			{@const connectionPrefetched = {
				[EntityMetaKey.Selector]: {
					connectionKey,
				},
				connectionKey,
				$wallet: {
					[EntityMetaKey.Selector]: {
						id: connection.walletId,
					},
					id: connection.walletId,
					name: candidate?.name ?? connection.walletId,
					protocol: connection.protocol,
				},
				status: connection.status,
				protocol: connection.protocol,
				transportKind: connection.transportKind,
				selected: connection.selected,
			}}
			<article
				data-column-item="flexible"
				data-card
				data-scroll-container
			>
				<BlockheadWalletConnectionView
					selection={connectionSelection}
					prefetched={connectionPrefetched}
					layout={EntityLayout.SummaryInline}
					open={false}
				/>

				{#if candidate == null}
					<p data-text="muted">Provider unavailable. This saved connection is read-only.</p>
				{/if}

				{#if connection.error}
					<p role="alert">{connection.error}</p>
				{/if}

				{#if connection.status === BlockheadConnectionStatus.Connected && connection.accounts.length > 0}
					<fieldset data-column="gap-1">
						<legend>Active account and network</legend>

						{#each connection.accounts as account (`${account.namespace}:${account.reference}:${account.accountAddress}`)}
							<label
								data-card
								data-row="start align-center gap-1"
							>
								<input
									type="radio"
									name={`${id}-${connectionKey}-active-account`}
									checked={
										connection.selected
										&& connection.activeAccount?.namespace === account.namespace
										&& connection.activeAccount.reference === account.reference
										&& connection.activeAccount.accountAddress === account.accountAddress
									}
									onchange={() => walletRuntime.selectAccount(
										connectionKey,
										account,
									)}
								/>
								<TruncatedValue value={account.accountAddress} />
								<span data-text="muted">{account.namespace}:{account.reference}</span>
							</label>
						{/each}
					</fieldset>
				{/if}

				<div data-row="start wrap gap-2">
					{#if (
						connection.status === BlockheadConnectionStatus.Error
						|| connection.status === BlockheadConnectionStatus.Disconnected
					) && walletRuntime.candidates.some((candidate) => (
						candidate.id === connection.walletId
						&& candidate.capabilities.includes(WalletCapability.Reconnect)
					))}
						<button
							type="button"
							onclick={() => walletRuntime.connect(connection.walletId)}
						>
							Retry {connection.status === BlockheadConnectionStatus.Error ? 'connection' : 'connect'}
						</button>
					{/if}

					{#if connection.status === BlockheadConnectionStatus.Connected && candidate != null}
						<button
							type="button"
							onclick={() => walletRuntime.disconnect(connectionKey)}
						>
							{candidate.capabilities.includes(WalletCapability.Disconnect) ?
								'Disconnect wallet'
							:
								'Disconnect from Blockhead'}
						</button>
					{:else}
						<button
							type="button"
							onclick={() => walletRuntime.remove(connectionKey)}
						>
							{connection.status === BlockheadConnectionStatus.Connecting ?
								'Cancel connection'
							:
								'Remove connection'}
						</button>
					{/if}
				</div>
			</article>
		{/each}
	{/if}

	{#if availableCandidates.length > 0}
		{#each availableCandidates.toSorted((candidateA, candidateB) => candidateA.name.localeCompare(candidateB.name)) as candidate (candidate.id)}
			<article
				data-column-item="flexible"
				data-card
				data-scroll-container
			>
				<BlockheadWalletView
					selection={select(EntityType.BlockheadWallet, {
						id: candidate.id,
					})}
					prefetched={{
						[EntityMetaKey.Selector]: {
							id: candidate.id,
						},
						id: candidate.id,
						name: candidate.name,
						protocol: candidate.protocol,
					}}
					layout={EntityLayout.SummaryInline}
					open={false}
				/>

				{#if candidate.capabilities.includes(WalletCapability.Connect)}
					<button
						type="button"
						data-row="start align-center gap-1"
						onclick={() => walletRuntime.connect(candidate.id)}
					>
						{#if candidate.icon}
							<Icon
								src={candidate.icon}
								alt=""
							/>
						{/if}
						<span>Connect {candidate.name}</span>
					</button>
				{:else}
					<output aria-live="polite">Detected</output>
				{/if}
			</article>
		{/each}
	{/if}
{/if}
