<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconSlot>
			title?: string
			typeAnnotationParagraphs?: string[]
			placeholderText?: string
			emptyText?: string
			open?: boolean
			collapsible?: boolean
			showTypeAnnotation?: boolean
			id?: string
		},
		Pick<
			ComponentProps<typeof EntitiesList>,
			| 'href'
			| 'CollapsibleProps'
		>
	> = $props()

	const collectionSelection = $derived(selection)


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
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
		{@const selection = select(EntityType.BeaconSlot, beaconSlot[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const beaconSlotHrefFields = { ...beaconSlot, ...beaconSlot[EntityMetaKey.Selector] }}
		<BeaconSlotView
			selection={selection}
			prefetched={beaconSlotFields}
			href={
				(beaconSlotHrefFields.slot !== undefined && beaconSlotHrefFields.$network !== undefined && beaconSlotHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
					slot: String(beaconSlotHrefFields.slot ?? ''),
					network: String(caip2StringFromValue(beaconSlotHrefFields.$network.caip2) ?? ''),
				}) : beaconSlotHrefFields.slot !== undefined && beaconSlotHrefFields.$network !== undefined && beaconSlotHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]', {
					slot: String(beaconSlotHrefFields.slot ?? ''),
					network: String(beaconSlotHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
