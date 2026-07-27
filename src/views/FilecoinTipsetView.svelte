<!-- Generated from APP.ts. Do not edit by hand. -->

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
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.FilecoinTipset> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))
	const filecoinTipset = $derived(viewSelection({
		fields: {
			timestampMs: true,
		},
	}))
	const titleFallback = $derived(String(pendingEntity.height ?? '') || 'filecoin tipset')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import FilecoinBlocksView from '$/views/FilecoinBlocksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import FilecoinTipsetView from '$/views/FilecoinTipsetView.svelte'
</script>


<EntityView
	entityType={EntityType.FilecoinTipset}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={pendingEntity.height}
		/>
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.tipsetKey ?? '') || String(pendingEntity.height ?? '') || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinTipset}>
			{#snippet children(entity)}
				{@const timestampMs0 = entity.timestampMs}
				{#if timestampMs0 != null}
					<span data-text="muted">
						<Timestamp timestamp={Number(timestampMs0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={pendingEntity.height}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					{pendingEntity.tipsetKey}
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$parent}
			>
				{#snippet children(filecoinTipset)}
					{#if filecoinTipset != null}
						<div>
							<dt>Parent</dt>
							<dd>
								<FilecoinTipsetView
									selection={select(EntityType.FilecoinTipset, filecoinTipset[EntityMetaKey.Selector])}
									prefetched={filecoinTipset}
									layout={EntityLayout.Value}
									open={false}
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
							parentWeight: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentWeight = entity.parentWeight}
					{#if parentWeight != null}
						<div>
							<dt>Parent weight</dt>
							<dd>
								<NumberValue
									value={parentWeight}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={filecoinTipset}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={Number(timestampMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const filecoinTipsetFilecoinBlocksViewBlocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={filecoinTipsetFilecoinBlocksViewBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinBlocksView
						selection={filecoinTipsetFilecoinBlocksViewBlocksResource}
						countResource={filecoinTipsetFilecoinBlocksViewBlocksResource.count}
						title='Blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
