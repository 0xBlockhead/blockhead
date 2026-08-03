<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.HyperliquidSpotAsset> = $props()

	const hyperliquidSpotAsset = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
		fields: {
			name: true,
			szDecimals: true,
			weiDecimals: true,
			tokenId: true,
		},
	}))
	const titleFallback = $derived((prefetched.name ?? '') || String(selection.entitySelector.assetId) || 'hyperliquid spot asset')
	const viewDomId = $derived('hyperliquid-spot-asset-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import EntitiesList from '$/components/EntitiesList.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidSpotAsset}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={hyperliquidSpotAsset}>
			{#snippet children(entity)}
				{(entity.name ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<NumberValue
			value={selection.entitySelector.assetId}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>asset ID</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.assetId}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={hyperliquidSpotAsset}
			>
				{#snippet children(entity)}
					{@const name = entity.name}
					{#if name != null}
						<div>
							<dt>Name</dt>
							<dd>
								{name}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidSpotAsset}
			>
				{#snippet children(entity)}
					{@const szDecimals = entity.szDecimals}
					{#if szDecimals != null}
						<div>
							<dt>sz decimals</dt>
							<dd>
								<NumberValue
									value={szDecimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={hyperliquidSpotAsset}
			>
				{#snippet children(entity)}
					{@const weiDecimals = entity.weiDecimals}
					{#if weiDecimals != null}
						<div>
							<dt>wei decimals</dt>
							<dd>
								<NumberValue
									value={weiDecimals}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={hyperliquidSpotAsset}
			>
				{#snippet children(entity)}
					{@const tokenId = entity.tokenId}
					{#if tokenId != null}
						<div>
							<dt>Token ID</dt>
							<dd>
								<TruncatedValue value={tokenId} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		<CollapsibleTabs
			id={viewDomId + '-carousel-hyperliquid-spot-asset-activity'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'hyperliquid-spot-asset-base-pairs',
						label: 'Base Pairs',
					},
					{
						id: 'hyperliquid-spot-asset-quote-pairs',
						label: 'Quote Pairs',
					},
				]
			}
			data-card
			class='network-view-collapsible-activity'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Activity</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionHyperliquidSpotAssetBasePairs({ id, label })}
				<EntitiesList
					entityType={EntityType.HyperliquidSpotPair}
					collapsible={false}
					title={label}
					emptyText='No base pairs.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$basePairs()}
				>
					{#snippet Item({ item: hyperliquidSpotPair })}
						<EntityView
							entityType={EntityType.HyperliquidSpotPair}
							entitySelector={hyperliquidSpotPair[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

			{#snippet SectionHyperliquidSpotAssetQuotePairs({ id, label })}
				<EntitiesList
					entityType={EntityType.HyperliquidSpotPair}
					collapsible={false}
					title={label}
					emptyText='No quote pairs.'
					open={true}
					id={`${id}-list`}
					resource={selection.$$quotePairs()}
				>
					{#snippet Item({ item: hyperliquidSpotPair })}
						<EntityView
							entityType={EntityType.HyperliquidSpotPair}
							entitySelector={hyperliquidSpotPair[EntityMetaKey.Selector]}
						/>
					{/snippet}
				</EntitiesList>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
