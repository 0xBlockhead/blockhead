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
		title = 'Attestations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconAttestations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BeaconAttestation>
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
	entityType={EntityType.BeaconAttestation}
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
	getResourceItems={(beaconAttestations) => [...new Map(beaconAttestations.values.map((beaconAttestation) => [beaconAttestation[EntityMetaKey.SelectorKey], beaconAttestation])).values()]}
	getKey={(beaconAttestation) => beaconAttestation[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Beacon attestations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: beaconAttestation })}
		{@const beaconAttestationFields = { ...beaconAttestation[EntityMetaKey.Selector], ...beaconAttestation }}
		<EntityView
			entityType={EntityType.BeaconAttestation}
			entitySelector={beaconAttestation[EntityMetaKey.Selector]}
			href={
				(
					beaconAttestation[EntityMetaKey.Selector] != null && 'slot' in beaconAttestation[EntityMetaKey.Selector]
					&& beaconAttestation[EntityMetaKey.Selector].slot != null
					&& beaconAttestation[EntityMetaKey.Selector] != null && 'indexInSlot' in beaconAttestation[EntityMetaKey.Selector]
					&& beaconAttestation[EntityMetaKey.Selector].indexInSlot != null
					&& beaconAttestation[EntityMetaKey.Selector] != null && '$network' in beaconAttestation[EntityMetaKey.Selector] ?
						beaconAttestation[EntityMetaKey.Selector].$network != null && 'caip2' in beaconAttestation[EntityMetaKey.Selector].$network
						&& beaconAttestation[EntityMetaKey.Selector].$network.caip2 != null ?
							resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
						slot: String(beaconAttestation[EntityMetaKey.Selector].slot ?? ''),
						index: String(beaconAttestation[EntityMetaKey.Selector].indexInSlot ?? ''),
						network: String(caip2StringFromValue(beaconAttestation[EntityMetaKey.Selector].$network.caip2) ?? ''),
					})
					:
							beaconAttestation[EntityMetaKey.Selector].$network != null && 'slug' in beaconAttestation[EntityMetaKey.Selector].$network
							&& beaconAttestation[EntityMetaKey.Selector].$network.slug != null ?
								resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
							slot: String(beaconAttestation[EntityMetaKey.Selector].slot ?? ''),
							index: String(beaconAttestation[EntityMetaKey.Selector].indexInSlot ?? ''),
							network: String(beaconAttestation[EntityMetaKey.Selector].$network.slug ?? ''),
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
				{(String((beaconAttestationFields.indexInSlot) ?? '') ? 'Attestation #' + String((beaconAttestationFields.indexInSlot) ?? '') : '') || 'beacon attestation'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[(String((beaconAttestationFields.slot) ?? '') ? 'Slot ' + String((beaconAttestationFields.slot) ?? '') : '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
