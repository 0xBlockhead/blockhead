<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconBlock_Timestamp>, 'prefetched'> = $props()

	const block = $derived(selection.entitySelector.$block)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Beacon_Rest,
		],
	}))
	const beaconBlockTimestamp = $derived(viewSelection({
		fields: {
			finalized: true,
			executionOptimistic: true,
		},
	}))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BeaconBlockView from '$/views/BeaconBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconBlock_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.timestampMs)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/beacon-block/[root=zeroExHex]/(beaconBlock)/observation/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in block.$network ?
							caip2StringFromValue(block.$network.caip2)
						:
							block.$network.slug
					),
					root: block.root,
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
	{#snippet Title()}
		<Timestamp timestamp={selection.entitySelector.timestampMs} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={beaconBlockTimestamp}>
			{#snippet children(entity)}
				{[String(entity.finalized), String(entity.executionOptimistic)].filter(Boolean).join(' ') || String(selection.entitySelector.timestampMs)}
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
				<dt>Block</dt>
				<dd>
					<BeaconBlockView
						selection={select(EntityType.BeaconBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Retrieved at</dt>
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

			<div>
				<dt>Canonical</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									canonical: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.canonical ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Execution optimistic</dt>
				<dd>
					<ResourceBoundary
						resource={beaconBlockTimestamp}
					>
						{#snippet children(entity)}
							{entity.executionOptimistic ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Finalized</dt>
				<dd>
					<ResourceBoundary
						resource={beaconBlockTimestamp}
					>
						{#snippet children(entity)}
							{entity.finalized ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
