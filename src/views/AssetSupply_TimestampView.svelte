<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AssetSupply_Timestamp>, 'prefetched'> = $props()

	const assetInstance = $derived(selection.entitySelector.$assetInstance)
	const assetSupplyTimestamp = $derived(selection({
		fields: {
			totalSupply: true,
			$assetInstance: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			circulatingSupply: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AssetClassView from '$/views/AssetClassView.svelte'
	import AssetInstanceView from '$/views/AssetInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.AssetSupply_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.supplyScopeKey || 'asset supply timestamp')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/asset/[kind=stringSegment]/[assetKey=stringSegment]/(assetInstance)/supply/[supplyScopeKey=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in assetInstance.$network ?
							caip2StringFromValue(assetInstance.$network.caip2)
						:
							assetInstance.$network.slug
					),
					kind: assetInstance.kind,
					assetKey: assetInstance.assetKey,
					supplyScopeKey: selection.entitySelector.supplyScopeKey,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={assetSupplyTimestamp}>
			{#snippet children(entity)}
				{@const totalSupply = entity.totalSupply}
				{#if totalSupply != null}
					<NumberValue
						value={totalSupply}
						decimalPlaces={selection.entitySelector.$assetInstance.decimals}
					/>

					<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
				{/if}
				{@const circulatingSupply = entity.circulatingSupply}
				{#if circulatingSupply != null}
					<NumberValue
						value={circulatingSupply}
						decimalPlaces={selection.entitySelector.$assetInstance.decimals}
					/>

					<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			{selection.entitySelector.source}
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Supply scope key</dt>
				<dd>
					{selection.entitySelector.supplyScopeKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							classKey: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const classKey = entity.classKey}
					{#if classKey != null}
						<div>
							<dt>Class key</dt>
							<dd>
								{classKey}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={assetSupplyTimestamp}
			>
				{#snippet children(entity)}
					{@const totalSupply = entity.totalSupply}
					{#if totalSupply != null}
						<div>
							<dt>Total supply</dt>
							<dd>
								<NumberValue
									value={totalSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={assetSupplyTimestamp}
			>
				{#snippet children(entity)}
					{@const circulatingSupply = entity.circulatingSupply}
					{#if circulatingSupply != null}
						<div>
							<dt>Circulating supply</dt>
							<dd>
								<NumberValue
									value={circulatingSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							burnedSupply: true,
							$assetInstance: {
								fields: {
									decimals: true,
									symbol: true,
								},
							},
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const burnedSupply = entity.burnedSupply}
					{#if burnedSupply != null}
						<div>
							<dt>Burned supply</dt>
							<dd>
								<NumberValue
									value={burnedSupply}
									decimalPlaces={selection.entitySelector.$assetInstance.decimals}
								/>

								<span>{selection.entitySelector.$assetInstance.symbol == null ? '' : ` ${selection.entitySelector.$assetInstance.symbol}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							methodology: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const methodology = entity.methodology}
					{#if methodology != null}
						<div>
							<dt>Methodology</dt>
							<dd>
								{methodology}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$class}
			>
				{#snippet children(assetClass)}
					{#if assetClass != null}
						<div>
							<dt>Class</dt>
							<dd>
								<AssetClassView
									selection={select(EntityType.AssetClass, assetClass[EntityMetaKey.Selector])}
									prefetched={assetClass}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Asset instance</dt>
				<dd>
					<AssetInstanceView
						selection={select(EntityType.AssetInstance, selection.entitySelector.$assetInstance)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
