<script lang="ts">
	// Types/constants
	import type { ComponentProps, Snippet } from 'svelte'
	import type { EntityId } from '$/schema/$schema.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { stringify } from 'devalue'
import { EntityMetaKey } from '$/schema/$EntityDefinition.ts'
import { EntityType } from '$/schema/$EntityType.ts'
import { CoinInstanceType } from '$/schema/CoinInstance.ts'
import { schema } from '$/schema/index.ts'
import { Source } from '$/sources/$Source.ts'


	// Props
	let {
		children,
		entityId,
		href,
		open = $bindable(true),
		...entityViewRest
	}: WithRest<
		{
			children?: Snippet
			entityId: EntityId<typeof schema, EntityType.CoinInstance>
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
		>
	> = $props()


	// State
	import { useEntity } from '$/collections/$queries.svelte.ts'

	const coinInstanceKey = $derived(
		stringify(entityId),
	)


	const nativeOrErcTitle = (
		entityId.type === CoinInstanceType.NativeCurrency ?
			(
				`Native (${entityId.$network.chainId})`
			)
		:
			(
				`ERC-20 (${entityId.$network.chainId})`
			)
	)


	const coinInstance = useEntity(
		EntityType.CoinInstance,
		entityId,
		{
			$: [
				Source.Coingecko_Rest,
				Source.Constants_Internal,
			],
			$icon: {},
			name: {},
			symbol: {},
			...(open ?
				{
					decimals: {},
					caip19: {},
					$$marketsWithInstanceAsBase: {},
					$$marketsWithInstanceAsQuote: {},
				}
				:
				{}),
		},
	)


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntityDetails from '$/components/EntityDetails.svelte'
	import EntityView from '$/components/EntityView.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import IconComponent from '$/components/Icon.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Address from '$/views/Address.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<EntityView
	entityType={EntityType.CoinInstance}
	bind:open
	{entityId}
	{href}
	{...entityViewRest}
>
	{#snippet Icon()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText=""
		>
			{#snippet children(live)}
				{#if live.$icon?.[EntityMetaKey.Id].url !== undefined}
					<IconComponent
						src={live.$icon[EntityMetaKey.Id].url}
						alt={live.symbol ?? live.name ?? ''}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Heading()}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading…"
		>
			{#snippet children(live)}
				{live.symbol ?? live.name ?? nativeOrErcTitle}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Id()}
		<span data-text="font-monospace">
			{entityId.$coin.coinId}
		</span>
	{/snippet}

	{#snippet TypeAnnotationTooltip()}
		<p>
			Per-chain <strong>deployment</strong>
			of a logical coin: native asset or bytecode-bound token with resolver-backed fields—when upstream data allows, the row exposes an honest <strong>CAIP-19</strong>
			asset id for cross-wallet routing and quote attribution.
		</p>
	{/snippet}

	{#snippet Content({ title: _title, href: _href })}
		<ResourceBoundary
			resource={coinInstance}
			placeholderText="Loading coin instance…"
		>
			{#snippet children(live)}
				<dl data-column-item="center">
					<div>
						<dt>Coin id</dt>
						<dd data-text="mono">
							{@render Id()}
						</dd>
					</div>
					<div>
						<dt>Chain</dt>
						<dd>{String(entityId.$network.chainId)}</dd>
					</div>
					<div>
						<dt>Kind</dt>
						<dd>
							{#if entityId.type === CoinInstanceType.NativeCurrency}
								Native
							{:else}
								<Address
									network={entityId.$contract.$network}
									address={entityId.$contract.address}
								/>
							{/if}
						</dd>
					</div>
					{#if open}
						{#if live.name !== undefined}
							<div>
								<dt>Name</dt>
								<dd>{live.name}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if live.symbol !== undefined}
							<div>
								<dt>Symbol</dt>
								<dd>{live.symbol}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if live.decimals !== undefined}
							<div>
								<dt>Decimals</dt>
								<dd>{String(live.decimals)}</dd>
							</div>
						{/if}
					{/if}

					{#if open}
						{#if live.caip19 !== undefined}
							<div>
								<dt>CAIP-19</dt>
								<dd>{live.caip19}</dd>
							</div>
						{/if}
					{/if}
				</dl>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Details({
		open: _open,
	})}
		<EntityDetails
			entityType={EntityType.CoinInstance}
			{entityId}
		/>

		<div
			class="entity-view-detail-carousels"
			data-column="gap-3"
		>
			<CollapsibleTabs
				id={`${coinInstanceKey}:carousel-markets`}
				{...{ 'data-card': '' }}
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({ open: _isOpen })}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>
							Markets
						</HeadingComponent>
					</header>
				{/snippet}

				{#snippet Markers()}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(live)}
							{#if (live.$$marketsWithInstanceAsBase ?? []).length}
								<a
									data-scroll-marker-label="Base"
									href={`#${coinInstanceKey}:markets-base`}
								>Base</a>
							{/if}

							{#if (live.$$marketsWithInstanceAsQuote ?? []).length}
								<a
									data-scroll-marker-label="Quote"
									href={`#${coinInstanceKey}:markets-quote`}
								>Quote</a>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}

				{#snippet children(_childrenContext)}
					<ResourceBoundary resource={coinInstance}>
						{#snippet children(live)}
							{#if (live.$$marketsWithInstanceAsBase ?? []).length}
								<section>
									<MarketsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$marketsWithInstanceAsBase',
										}}
										{href}
										id={`${coinInstanceKey}:markets-base`}
										open={false}
										title="Base"
									/>
								</section>
							{/if}

							{#if (live.$$marketsWithInstanceAsQuote ?? []).length}
								<section>
									<MarketsView
										collapsible={false}
										entityFieldReference={{
											entityType: EntityType.CoinInstance,
											entityId,
											fieldName: '$$marketsWithInstanceAsQuote',
										}}
										{href}
										id={`${coinInstanceKey}:markets-quote`}
										open={false}
										title="Quote"
									/>
								</section>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</CollapsibleTabs>

			{#if children}
				<CollapsibleTabs
					id={`${coinInstanceKey}:carousel-extra`}
					{...{ 'data-card': '' }}
					scrollContainerProps={{
						'data-row': 'start align-start',
					}}
				>
					{#snippet Summary({ open: _isOpen })}
						<header data-row-item="flexible" data-row="wrap gap-4">
							<HeadingComponent>
								More
							</HeadingComponent>
						</header>
					{/snippet}

					{#snippet Markers()}
						<a
							data-scroll-marker-label="Content"
							href={`#${coinInstanceKey}:coin-instance-extra`}
						>Content</a>
					{/snippet}

					{#snippet children(_childrenContext)}
						<section id={`${coinInstanceKey}:coin-instance-extra`}>
							{@render children()}
						</section>
					{/snippet}
				</CollapsibleTabs>
			{/if}
		</div>
	{/snippet}
</EntityView>


<style>
	.entity-view-detail-carousels :global(.collapsible-tabs-scroll[data-scroll-container]) {
		&[data-scroll-container] {
			--scrollContainer-sizeBlock: calc(80cqb - 6rem);
			max-block-size: var(--scrollContainer-sizeBlock);

			&[data-scroll-container~='layout-carousel'] {
				--carousel-basis: 40ch;
			}
		}
	}
</style>
