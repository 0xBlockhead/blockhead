<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'




	// State
	let {
		selection,
		countResource,
		title = 'Slots',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSlots-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconSlot>
			countResource?: SvelteKitResource<number>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		EntitiesListForwardProps
	> = $props()


	// Components
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconSlot}
	{id}
	{title}
	bind:open
	{collapsible}
	{showTypeAnnotation}
	TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	resource={
		selection({
			sources: selection.sources,
			fields: {
				slot: true,
				$epoch: true,
				$network: true,
			},
		})
	}
	{countResource}
	getResourceItems={(beaconSlots) => [...new Map(beaconSlots.values.map((beaconSlot) => [beaconSlot[EntityMetaKey.SelectorKey], beaconSlot])).values()]}
	getKey={(beaconSlot) => beaconSlot[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon slots yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconSlot })}
		{@const beaconSlotFields = { ...beaconSlot[EntityMetaKey.Selector], ...beaconSlot }}
		<EntityView
			entityType={EntityType.BeaconSlot}
			entitySelector={beaconSlot[EntityMetaKey.Selector]}
			href={
				(
					beaconSlot[EntityMetaKey.Selector] != null && 'slot' in beaconSlot[EntityMetaKey.Selector]
					&& beaconSlot[EntityMetaKey.Selector].slot != null
					&& beaconSlot[EntityMetaKey.Selector] != null && '$network' in beaconSlot[EntityMetaKey.Selector] ?
						beaconSlot[EntityMetaKey.Selector].$network != null && 'caip2' in beaconSlot[EntityMetaKey.Selector].$network
						&& beaconSlot[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
						slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
						network: String(caip2StringFromValue(beaconSlot[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconSlot[EntityMetaKey.Selector].$network != null && 'slug' in beaconSlot[EntityMetaKey.Selector].$network
							&& beaconSlot[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
							slot: String(beaconSlot[EntityMetaKey.Selector].slot ?? ''),
							network: String(beaconSlot[EntityMetaKey.Selector].$network.slug ?? ''),
						})
						:
							undefined
				:
						undefined
				)
			}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{(String((beaconSlotFields.slot) ?? '') ? 'Slot #' + String((beaconSlotFields.slot) ?? '') : '') || 'beacon slot'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((beaconSlotFields.$epoch.epoch) ?? '') ? 'Epoch #' + String((beaconSlotFields.$epoch.epoch) ?? '') : '') || 'beacon epoch'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
