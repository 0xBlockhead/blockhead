<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityType } from '$/schema/$EntityType.ts'
	import type { EntityId } from '$/schema/$schema.ts'
	import { schema } from '$/schema/index.ts'
	import { blockheadWalletConnectionStatuses } from '$/constants/Blockhead.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		icon,
		accounts,
		chainId,
		status,
		error,
		onRemove,
		entityId,
		href = resolve(
			'/~/(accounts)/accounts/(connections)/connection/[connectionId]',
			{ connectionId: entityId.id },
		),
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
		},
		never
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

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
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import ActorView from '$/views/ActorView.svelte'
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

	{#snippet Heading()}
		{title}
	{/snippet}

	{#snippet Value()}
		<span>
			{entityId.id}
		</span>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			EIP-1193 exposes the wallet’s selected accounts and current chain id to the page; dapps read them when constructing transactions.
		</p>
		<p>
			Those handles are not Farcaster FIDs, on-chain contract labels, or a general-purpose contact book.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<div data-column="gap-1">

			<dl data-column-item="center">

				<div>
					<dt>Status</dt>
					<dd>{blockheadWalletConnectionStatuses[status].label}</dd>
				</div>

				{#if accounts[0]}
				<div>
					<dt>Primary account</dt>
					<dd>
						{#if chainId !== null}
							<ActorNetworkView
								entityId={{
									$network: { chainId },
									$actor: {
										address: accounts[0],
									},
								}}
								layout={EntityLayout.Title}
								open={false}
							/>
						{:else}
							<ActorView
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

				{#if open}
				<ResourceBoundary
					resource={walletConnection}
					placeholderText="Loading wallet connection…"
				>
					{#snippet children(loadedWalletConnection)}
						<div>
							<dt>Selected</dt>
							<dd>{loadedWalletConnection.selected ? 'Yes' : 'No'}</dd>
						</div>

						<div>
							<dt>Connected at</dt>
							<dd>
								<Timestamp
									timestamp={loadedWalletConnection.connectedAt}
								/>
							</dd>
						</div>
					{/snippet}
				</ResourceBoundary>
				{/if}
			</dl>
		</div>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.BlockheadWalletConnection}
			{entityId}
		/>
		{#if error}
			<p
				role="alert"
			>
				{error}
			</p>
		{/if}

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
			data-carousel-basis="40ch"
		>
			<CollapsibleTabs
				id={`${walletConnectionKey}:carousel-wallet`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Wallet connection
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers({ open: _markersOpen })}
					{#if accounts.length}
						<a
							data-scroll-marker-label="Accounts"
							href={`#${walletConnectionKey}:wallet-accounts`}
						>Accounts</a>
					{/if}
					<a
						data-scroll-marker-label="Actions"
						href={`#${walletConnectionKey}:wallet-actions`}
					>Actions</a>
				{/snippet}

				{#snippet body({ open: _bodyOpen })}
					{#if accounts.length}
						<section id={`${walletConnectionKey}:wallet-accounts`}>
							<ul
								data-column="gap-1"
								data-list="unstyled"
							>
								{#each accounts as address (address)}
									<li>
										{#if chainId !== null}
											<ActorNetworkView
												entityId={{
													$network: { chainId },
													$actor: { address },
												}}
											/>
										{:else}
											<ActorView
												entityId={{ address }}
												href={resolve('/account/[address]', {
													address: address,
												})}
											/>
										{/if}
									</li>
								{/each}
							</ul>
						</section>
					{:else}
						<section>
							<p data-text="muted">
								No accounts are connected to this wallet yet.
							</p>
						</section>
					{/if}

					<section id={`${walletConnectionKey}:wallet-actions`}>
						<div data-row>
							<button
								type="button"
								onclick={onRemove}
							>
								Remove
							</button>
						</div>
					</section>
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>


<style>

</style>

