<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.OsmosisPoolAsset>, 'prefetched'> = $props()

	const osmosisPoolAsset = $derived(selection({
		sources: selection.sources ?? [
			Source.Osmosis_LCD_Rest,
		],
		fields: {
			amount: true,
			weight: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.denom || 'Osmosis pool asset')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import OsmosisPoolView from '$/views/OsmosisPoolView.svelte'
	import CosmosDenomView from '$/views/CosmosDenomView.svelte'
</script>


<EntityView
	entityType={EntityType.OsmosisPoolAsset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Value()}
		<ResourceBoundary resource={osmosisPoolAsset}>
			{#snippet children(entity)}
				{[entity.amount, (entity.weight ?? '')].filter(Boolean).join(' ') || selection.entitySelector.denom || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Pool</dt>
				<dd>
					<OsmosisPoolView
						selection={select(EntityType.OsmosisPool, selection.entitySelector.$pool)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Denom</dt>
				<dd>
					{selection.entitySelector.denom}
				</dd>
			</div>

			<div>
				<dt>Amount</dt>
				<dd>
					<ResourceBoundary
						resource={osmosisPoolAsset}
					>
						{#snippet children(entity)}
							{entity.amount}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={osmosisPoolAsset}
			>
				{#snippet children(entity)}
					{@const weight = entity.weight}
					{#if weight != null}
						<div>
							<dt>Weight</dt>
							<dd>
								{weight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$cosmosDenom}
			>
				{#snippet children(cosmosDenom)}
					{#if cosmosDenom != null}
						<div>
							<dt>Cosmos denom</dt>
							<dd>
								<CosmosDenomView
									selection={select(EntityType.CosmosDenom, cosmosDenom[EntityMetaKey.Selector])}
									prefetched={cosmosDenom}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
