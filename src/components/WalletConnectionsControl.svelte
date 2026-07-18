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
		candidate.capabilities.includes(WalletCapability.Connect)
		&& !walletRuntime.connections.some((connection) => connection.walletId === candidate.id)
	)) ?? [])


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BlockheadWalletConnectionView from '$/views/BlockheadWalletConnectionView.svelte'
	import Icon from '$/components/Icon.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


{#if walletRuntime}
	{#if walletRuntime.connections.length > 0}
		{#each walletRuntime.connections.toSorted((connectionA, connectionB) => (
			(connectionA.connectionKey ?? connectionA.walletId).localeCompare(connectionB.connectionKey ?? connectionB.walletId)
		)) as connection (connection.connectionKey ?? connection.walletId)}
			<article
				data-column-item="flexible"
				data-card
				data-scroll-container
			>
						<BlockheadWalletConnectionView
							selection={select(EntityType.BlockheadWalletConnection, {
								connectionKey: connection.connectionKey ?? connection.walletId,
							})}
							prefetched={{
								[EntityMetaKey.Selector]: {
									connectionKey: connection.connectionKey ?? connection.walletId,
								},
								connectionKey: connection.connectionKey ?? connection.walletId,
								status: connection.status,
								protocol: connection.protocol,
								transportKind: connection.transportKind,
								selected: connection.selected,
								error: connection.error,
							}}
							layout={EntityLayout.SummaryInline}
							open={false}
						/>
						<span>{connection.status}</span>

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
											name={`${id}-${connection.connectionKey ?? connection.walletId}-active-account`}
											checked={
												connection.selected
												&& connection.activeAccount?.namespace === account.namespace
												&& connection.activeAccount.reference === account.reference
												&& connection.activeAccount.accountAddress === account.accountAddress
											}
											onchange={() => walletRuntime.selectAccount(
												connection.connectionKey ?? connection.walletId,
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

							<button
								type="button"
								onclick={() => walletRuntime.disconnect(connection.connectionKey ?? connection.walletId)}
							>
								{connection.status === BlockheadConnectionStatus.Connecting ?
									'Cancel connection'
								: connection.status === BlockheadConnectionStatus.Connected ?
									'Disconnect'
								:
									'Remove connection'}
							</button>
						</div>
			</article>
		{/each}
	{/if}

	{#if availableCandidates.length > 0}
		<article
			data-column-item="flexible"
			data-card
			data-scroll-container
		>
			<div data-row="start wrap gap-2">
				{#each availableCandidates.toSorted((candidateA, candidateB) => candidateA.name.localeCompare(candidateB.name)) as candidate (candidate.id)}
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
				{/each}
			</div>
		</article>
	{/if}
{/if}
