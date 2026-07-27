<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BeaconSlashing> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = $derived((String(pendingEntity.indexInSlot ?? '') ? 'Slashing #' + String(pendingEntity.indexInSlot ?? '') : '') || 'beacon slashing')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconSlashing}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	idDragPlainText={String(pendingEntity.indexInSlot ?? '')}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/slashing/[kind=stringSegment]/[index=nonNegativeInteger]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				slot: String(selection.entitySelector.slot),
				kind: String(selection.entitySelector.kind),
				index: String(selection.entitySelector.indexInSlot),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{(String(pendingEntity.indexInSlot ?? '') ? 'Slashing #' + String(pendingEntity.indexInSlot ?? '') : '') || 'beacon slashing'}
	{/snippet}

	{#snippet Value()}
		{(pendingEntity.kind ?? '') || ([(pendingEntity.kind ?? ''), (String(pendingEntity.indexInSlot ?? '') ? ' #' + String(pendingEntity.indexInSlot ?? '') : '')].filter(Boolean).join(' ')) || titleFallback}
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<span>Slot </span>
			<NumberValue
				value={pendingEntity.slot}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Kind</dt>
				<dd>
					{pendingEntity.kind}
				</dd>
			</div>

			<div>
				<dt>Index in slot</dt>
				<dd>
					<NumberValue
						value={pendingEntity.indexInSlot}
					/>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={pendingEntity.slot}
					/>
				</dd>
			</div>

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
		</dl>
	{/snippet}
</EntityView>
