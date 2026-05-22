<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import { CoinInstanceType } from '$/schema/CoinInstance.ts'
	import { EntityType } from '$/schema/$EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/$Source.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		collapsible = true,
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.ActorCoin>
			href: string
			open?: boolean
		},
		Omit<
			ComponentProps<typeof EntityView>,
			| 'entityType'
			| 'entityId'
			| 'href'
			| 'open'
			| 'title'
			| 'Details'
			| 'Heading'
		>
	> = $props()


	// State
	import { stringify } from 'devalue'

	import { useEntity } from '$/collections/$queries.svelte.ts'


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
	{href}
	bind:open
	{...entityViewRest}
	summaryUsesHeading={true}
>
	{#snippet Title()}
		<span>
			{entityId.$coin.coinId}
		</span>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={actorCoin}
			placeholderText="Loading holding…"
		>
			{#snippet children(actorCoin)}
				{actorCoin.symbol ?? 'Balance'}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ title: _title, href: _href, open })}
		<dl data-column-item="center">
			<div>
				<dt>Wallet · chain</dt>
				<dd>
					<ActorNetworkView
						entityId={{
							$network: entityId.$coinInstance.$network,
							$actor: entityId.$actor,
						}}
						href={resolve(
							'/(explore)/(networks)/network/[networkId]/(network)/(accounts)/account/[address]',
							{
								networkId: String(entityId.$coinInstance.$network.chainId),
								address: entityId.$actor.address,
							},
						)}
						layout={EntityLayout.Title}
						open={false}
						showTypeAnnotation={false}
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
							href={resolve(
								'/(explore)/(networks)/network/[networkId]/(network)/(contracts)/contract/[address]',
								{
									networkId: String(entityId.$coinInstance.$contract.$network.chainId),
									address: entityId.$coinInstance.$contract.address,
								},
							)}
							layout={EntityLayout.Title}
							open={false}
							showTypeAnnotation={false}
						/>
					{:else}
						—
					{/if}
				</dd>
			</div>

			{#if open}
				<div>
					<dt>Balance (raw)</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.balance !== undefined}
									{String(actorCoin.balance)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>USD (estimate)</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.usdValue !== undefined}
									{String(actorCoin.usdValue)}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</dd>
				</div>
			{/if}

			{#if open}
				<div>
					<dt>Decimals</dt>
					<dd>
						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading balance…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.decimals !== undefined}
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
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
					style: '--carousel-basis: 36ch',
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

				{#snippet Markers(_context)}
					<a
						data-scroll-marker-label="Overview"
						href={`#${actorCoinDetailAnchorKey}:coin-overview`}
					>Overview</a>
					{#if children}
						<a
							data-scroll-marker-label="Related"
							href={`#${actorCoinDetailAnchorKey}:coin-related`}
						>Related</a>
					{/if}
				{/snippet}

				{#snippet body(_relatedChildren)}
					<section
						data-scroll-marker-label="Overview"
						id={`${actorCoinDetailAnchorKey}:coin-overview`}
					>
						<EntityDetails
							entityType={EntityType.ActorCoin}
							{entityId}
						/>

						<ResourceBoundary
							resource={actorCoin}
							placeholderText="Loading holding…"
						>
							{#snippet children(actorCoin)}
								{#if actorCoin.symbol == null}
									{#if actorCoin.decimals == null}
										{#if actorCoin.balance == null}
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
									{/if}
								{/if}
							{/snippet}
						</ResourceBoundary>
					</section>
					{#if children}
						<section
							data-scroll-marker-label="Related"
							id={`${actorCoinDetailAnchorKey}:coin-related`}
						>
							{@render children()}
						</section>
					{/if}
				{/snippet}
			</CollapsibleTabs>
		</div>
	{/snippet}
</EntityView>

<style>
	.actor-coin-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 36ch;
			}
		}
	}
</style>
