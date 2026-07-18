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
		title = 'Committees',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconCommittees-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconCommittee>
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
	import BeaconCommitteeView from '$/views/BeaconCommitteeView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.BeaconCommittee}
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
				indexInSlot: true,
				slot: true,
				$network: true,
			},
		})
	}
	getResourceItems={(beaconCommittees) => [...new Map(beaconCommittees.values.map((beaconCommittee) => [beaconCommittee[EntityMetaKey.SelectorKey], beaconCommittee])).values()]}
	getKey={(beaconCommittee) => beaconCommittee[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon committees yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconCommittee })}
		{@const beaconCommitteeFields = { ...beaconCommittee[EntityMetaKey.Selector], ...beaconCommittee }}
		{@const selection = select(EntityType.BeaconCommittee, beaconCommittee[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		{@const beaconCommitteeHrefFields = { ...beaconCommittee, ...beaconCommittee[EntityMetaKey.Selector] }}
		<BeaconCommitteeView
			selection={selection}
			prefetched={beaconCommitteeFields}
			href={
				(beaconCommitteeHrefFields.slot !== undefined && beaconCommitteeHrefFields.indexInSlot !== undefined && beaconCommitteeHrefFields.$network !== undefined && beaconCommitteeHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
					slot: String(beaconCommitteeHrefFields.slot ?? ''),
					index: String(beaconCommitteeHrefFields.indexInSlot ?? ''),
					network: String(caip2StringFromValue(beaconCommitteeHrefFields.$network.caip2) ?? ''),
				}) : beaconCommitteeHrefFields.slot !== undefined && beaconCommitteeHrefFields.indexInSlot !== undefined && beaconCommitteeHrefFields.$network !== undefined && beaconCommitteeHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
					slot: String(beaconCommitteeHrefFields.slot ?? ''),
					index: String(beaconCommitteeHrefFields.indexInSlot ?? ''),
					network: String(beaconCommitteeHrefFields.$network.slug ?? ''),
				}) : undefined)
			}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
