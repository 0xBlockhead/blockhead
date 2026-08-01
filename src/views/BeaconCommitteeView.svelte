<!-- Generated from APP.ts. -->

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
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.BeaconCommittee>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.BeaconCommittee}
	entitySelector={selection.entitySelector}
	title={title ?? `Committee #${selection.entitySelector.indexInSlot}`}
	idDragPlainText={String(selection.entitySelector.indexInSlot)}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/slot/[slot=nonNegativeInteger]/(beaconSlot)/committee/[index=nonNegativeInteger]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					slot: String(selection.entitySelector.slot),
					index: String(selection.entitySelector.indexInSlot),
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
		<span data-row="inline align-center gap-2 wrap">
			<span>Committee </span>
			<span data-badge="small">
				#{selection.entitySelector.indexInSlot}
			</span>
		</span>
	{/snippet}

	{#snippet Value()}
		<span data-badge="small">
			#{selection.entitySelector.indexInSlot}
		</span>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<span>Slot </span>
			<NumberValue
				value={selection.entitySelector.slot}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Index in slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.indexInSlot}
					/>
				</dd>
			</div>

			<div>
				<dt>Slot</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.slot}
					/>
				</dd>
			</div>

			<div>
				<dt>Validator indices</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									validatorIndices: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.validatorIndices.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
