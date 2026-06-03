<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { blockheadWalletConnectionStatusByStatus } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { useEntity } from '$/collections/$queries.svelte.ts'
	import { resolve } from '$app/paths'


	// State
	let {
		icon,
		accounts,
		chainId,
		status,
		error,
		onRemove,
		entityId,
		href = resolve(`/~/accounts/connections/connection/${encodeURIComponent(entityId.$wallet.rdns)}`),
		title,
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			icon?: string
			accounts: `0x${string}`[]
			chainId: number | null
			status: 'connecting' | 'connected' | 'error'
			error: string | null
			onRemove: () => void
			entityId: EntityId<typeof schema, EntityType.BlockheadWalletConnection>
			href?: string
			title: string
			open?: boolean
			collapsible?: boolean
		},
		never
	> = $props()

	const walletConnection = useEntity(
		EntityType.BlockheadWalletConnection,
		entityId,
		{
			$: [
				Source.Local_Internal,
			],
			...(open ?
				{
					selected: {},
					connectedAt: {},
				}
				:
				{}),
		},
	)


	// (Derived)
	const walletConnectionKey = $derived(
		stringify(entityId),
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EvmNetworkAccountView from '$/views/EvmNetworkAccountView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadWalletConnection}
	bind:open
	{entityId}
	href={href}
	{title}
	{...EntityViewProps}
>
	{#snippet Icon()}
		{#if icon}
			<IconComponent
				src={icon}
				alt={title}
			/>
		{/if}
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.$wallet.rdns}
		</span>
	{/snippet}

	{#snippet Title()}
		{title}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			EIP-1193 exposes the wallet’s selected accounts and current chain id to the page; dapps read them when constructing transactions.
		</p>
		<p>
			Those handles are not Farcaster FIDs, on-chain contract labels, or a general-purpose contact book.
		</p>
	{/snippet}

	{#snippet Content({})}
		<div data-column="gap-1">

			<dl data-column-item="center">

				<div>
					<dt>Status</dt>
					<dd>{blockheadWalletConnectionStatusByStatus[status].label}</dd>
				</div>

				{#if accounts[0]}
				<div>
					<dt>Primary account</dt>
					<dd>
						{#if chainId !== null}
							<EvmNetworkAccountView
								entityId={{
									$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
									$actor: {
										address: accounts[0],
									},
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
						{:else}
							<EvmAccountView
								entityId={{
									address: accounts[0],
								}}
								href={resolve('/account/[address]', {
									address: accounts[0],
								})}
								layout={EntityLayout.Title}
								open={false}
							/>
						{/if}
					</dd>
				</div>
				{/if}

				{#if chainId !== null}
				<div>
					<dt>Chain</dt>
					<dd>{String(chainId)}</dd>
				</div>
				{/if}

					<ResourceBoundary
						resource={walletConnection}
						placeholderText="Loading wallet connection…"
					>
						{#snippet children(walletConnection)}
							{#if open}
								<div>
									<dt>Selected</dt>
									<dd>{walletConnection.selected ? 'Yes' : 'No'}</dd>
								</div>
							{/if}

							{#if open}
								<div>
									<dt>Connected at</dt>
									<dd>
										<Timestamp
											timestamp={walletConnection.connectedAt}
										/>
									</dd>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		{#if error}
			<p
				role="alert"
			>
				{error}
			</p>
		{/if}

		<CollapsibleTabs
			id={`${walletConnectionKey}:carousel-wallet`}
			sectionIdPrefix={walletConnectionKey}
			sections={[
				{ id: 'wallet-accounts', label: 'Accounts' },
				{ id: 'wallet-actions', label: 'Actions' },
			]}
			data-card
		>
			{#snippet Summary({ open: _isOpen })}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>
						Wallet connection
					</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionWalletAccounts()}
				{#if accounts.length}
					<ul
						data-column="gap-1"
						data-blockheadWalletConnections="unstyled"
					>
						{#each accounts as address (address)}
							<li>
								{#if chainId !== null}
									<EvmNetworkAccountView
										entityId={{
											$network: { caip2: { namespace: 'eip155' as const, reference: String(chainId) } },
											$actor: { address },
										}}
									/>
								{:else}
									<EvmAccountView
										entityId={{ address }}
										href={resolve('/account/[address]', {
											address: address,
										})}
									/>
								{/if}
							</li>
						{/each}
					</ul>
				{:else}
					<p data-text="muted">
						No accounts are connected to this wallet yet.
					</p>
				{/if}
			{/snippet}

			{#snippet SectionWalletActions()}
				<div data-row>
					<button
						type="button"
						onclick={onRemove}
					>
						Remove
					</button>
				</div>
			{/snippet}
	</CollapsibleTabs>
	{/snippet}
</EntityView>


<style>

</style>
