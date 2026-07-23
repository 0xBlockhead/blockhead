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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconCommittee>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.BeaconCommittee}
			entitySelector={beaconCommittee[EntityMetaKey.Selector]}
			href={
				(
					beaconCommittee[EntityMetaKey.Selector] != null && 'slot' in beaconCommittee[EntityMetaKey.Selector]
					&& beaconCommittee[EntityMetaKey.Selector].slot != null
					&& beaconCommittee[EntityMetaKey.Selector] != null && 'indexInSlot' in beaconCommittee[EntityMetaKey.Selector]
					&& beaconCommittee[EntityMetaKey.Selector].indexInSlot != null
					&& beaconCommittee[EntityMetaKey.Selector] != null && '$network' in beaconCommittee[EntityMetaKey.Selector] ?
						beaconCommittee[EntityMetaKey.Selector].$network != null && 'caip2' in beaconCommittee[EntityMetaKey.Selector].$network
						&& beaconCommittee[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
						slot: String(beaconCommittee[EntityMetaKey.Selector].slot ?? ''),
						index: String(beaconCommittee[EntityMetaKey.Selector].indexInSlot ?? ''),
						network: String(caip2StringFromValue(beaconCommittee[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconCommittee[EntityMetaKey.Selector].$network != null && 'slug' in beaconCommittee[EntityMetaKey.Selector].$network
							&& beaconCommittee[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/committee/[index=nonNegativeInteger]', {
							slot: String(beaconCommittee[EntityMetaKey.Selector].slot ?? ''),
							index: String(beaconCommittee[EntityMetaKey.Selector].indexInSlot ?? ''),
							network: String(beaconCommittee[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconCommitteeFields.indexInSlot) ?? '') ? 'Committee #' + String((beaconCommitteeFields.indexInSlot) ?? '') : '') || 'beacon committee'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((beaconCommitteeFields.slot) ?? '') ? 'Slot ' + String((beaconCommitteeFields.slot) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
