<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.HyperliquidPerpMarket>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Hyperliquid,
		],
	}))
	const hyperliquidPerpMarket = $derived(viewSelection({
		fields: {
			maxLeverage: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.HyperliquidPerpMarket}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.coin || 'hyperliquid perp market')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/perp-market/[coin=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					coin: selection.entitySelector.coin,
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
		<ResourceBoundary resource={hyperliquidPerpMarket}>
			{#snippet children(entity)}
				{@const maxLeverage = entity.maxLeverage}
				{#if maxLeverage != null}
					<NumberValue
						value={maxLeverage}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
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
				<dt>coin</dt>
				<dd>
					{selection.entitySelector.coin}
				</dd>
			</div>

			<ResourceBoundary
				resource={hyperliquidPerpMarket}
			>
				{#snippet children(entity)}
					{@const maxLeverage = entity.maxLeverage}
					{#if maxLeverage != null}
						<div>
							<dt>max leverage</dt>
							<dd>
								<NumberValue
									value={maxLeverage}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							onlyIsolated: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const onlyIsolated = entity.onlyIsolated}
					{#if onlyIsolated != null}
						<div>
							<dt>only isolated</dt>
							<dd>
								{onlyIsolated}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
