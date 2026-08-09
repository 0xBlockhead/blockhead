<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
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
	}: Omit<EntitySelectionViewProps<EntityType.FilecoinTipset>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
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
	title={title ?? String(selection.entitySelector.height)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/tipset/[height=nonNegativeBigInt]/[tipsetKey=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					height: String(selection.entitySelector.height),
					tipsetKey: selection.entitySelector.tipsetKey,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.height}
		/>
	{/snippet}

	{#snippet Value()}
		{selection.entitySelector.tipsetKey || String(selection.entitySelector.height)}
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={filecoinTipset}>
			{#snippet children(entity)}
				{@const timestampMs = entity.timestampMs}
				{#if timestampMs != null}
					<span data-text="muted">
						<Timestamp timestamp={timestampMs} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Height</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.height}
					/>
				</dd>
			</div>

			<div>
				<dt>Tipset key</dt>
				<dd>
					{selection.entitySelector.tipsetKey}
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
									layout={EntityLayout.Value}
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
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const blocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={blocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<FilecoinBlocksView
						selection={blocksResource}
						countResource={blocksResource.count}
						title='Blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
