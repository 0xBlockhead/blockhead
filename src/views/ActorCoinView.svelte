<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		entityId,
		href = resolve(
			'/~/(accounts)/accounts/(balances)/balance/[chainId]/[owner]/[coin]',
			{
				chainId: String(entityId.$coinInstance.$network.chainId),
				owner: entityId.$actor.address,
				coin: (
					entityId.$coinInstance.type === CoinInstanceType.Erc20Token ?
						entityId.$coinInstance.$contract.address
					:
						pathNativeCoin
				),
			},
		),
		open = $bindable(true),
		collapsible = true,
		...EntityViewProps
	}: WithRest<
		{
			entityId: EntityId<typeof schema, EntityType.ActorCoin>
			href?: string
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'layout'
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const pathNativeCoin = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' as const

	const actorCoinDetailAnchorKey = stringify(entityId)

	const actorCoin = useEntity(
		EntityType.ActorCoin,
		entityId,
		{
			$: [Source.Allium_Rest],
			symbol: {},
			balance: {},
			...(open ?
				{
					decimals: {},
					usdValue: {},
				}
			:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Tooltip from '$/components/Tooltip.svelte'
	import ActorNetworkView from '$/views/ActorNetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
</script>


<EntityView
	entityType={EntityType.ActorCoin}
	{entityId}
	href={href}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading balance…"
		>
			{#snippet children(loadedActorCoin)}
				{loadedActorCoin.symbol ?? 'Balance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Title()}
		{@render Value()}
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading holding…"
		>
			{#snippet children(loadedActorCoin)}
				{loadedActorCoin.symbol ?? 'Balance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Wallet · chain</dt>
				<dd>
					<ActorNetworkView
						entityId={{
							$network: entityId.$coinInstance.$network,
							$actor: entityId.$actor,
						}}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
			<div>
				<dt>Asset</dt>
				<dd>
					{#if entityId.$coinInstance.type === CoinInstanceType.NativeCurrency}
						Native gas token (chain issuance)
					{:else if entityId.$coinInstance.type === CoinInstanceType.Erc20Token}
						<EvmContractView
							entityId={entityId.$coinInstance.$contract}
							layout={EntityLayout.SummaryDetails}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>

			{#if contentOpen}
				<div>
					<dt>Balance (raw)</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(loadedActorCoin)}
								{#if loadedActorCoin.balance !== undefined}
									{String(actorCoin.balance)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>USD (estimate)</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(loadedActorCoin)}
								{#if loadedActorCoin.usdValue !== undefined}
									{String(actorCoin.usdValue)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if contentOpen}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(loadedActorCoin)}
								{#if loadedActorCoin.decimals !== undefined}
									{String(actorCoin.decimals)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}
		</dl>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<div
			class="actor-coin-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${actorCoinDetailAnchorKey}:carousel-related`}
				sectionIdPrefix={actorCoinDetailAnchorKey}
				sections={[
					{ id: 'coin-overview', label: 'Overview' },
				]}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _relatedSummaryOpen })}
					<header
						data-row-item="flexible"
						data-row="wrap gap-4"
					>
						<HeadingComponent>
							Holding detail
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionCoinOverview({ id, label })}
					<EntityDetails
						entityType={EntityType.ActorCoin}
						{entityId}
					/>
					<ResourceBoundary
						resource={actorCoin}
						placeholderText="Loading holding…"
					>
						{#snippet children(loadedActorCoin)}
							{#if (
								actorCoin.symbol == null
								&& actorCoin.decimals == null
								&& actorCoin.balance == null
							)}
								<div data-row="wrap align-center gap-2">
									<p data-text="muted">
										No balance yet.
									</p>
									<Tooltip contentProps={{ side: 'top' }}>
										{#snippet Content()}
											<p>
												Symbol, decimals, and balance appear once this holding is resolved for the wallet on this network.
											</p>
										{/snippet}
										<abbr
											class="entity-heading-tip"
											aria-label="Token balance"
										>ⓘ</abbr>
									</Tooltip>
								</div>
							{/if}
						{/snippet}
					</ResourceBoundary>

				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>
