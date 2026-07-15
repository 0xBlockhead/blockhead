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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconAttestation>
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
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import BeaconAttestationView from '$/views/BeaconAttestationView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					indexInSlot: true,
					slot: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconAttestation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(beaconAttestations)}
			{@const uniqueBeaconAttestations = [...new Map(beaconAttestations.values.map((beaconAttestation) => [beaconAttestation[EntityMetaKey.SelectorKey], beaconAttestation])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconAttestation}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconAttestations.totalCount}
				getKey={(beaconAttestation) => beaconAttestation[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconAttestations}
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
					{@const selection = select(EntityType.BeaconAttestation, beaconAttestation[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const beaconAttestationHrefFields = { ...beaconAttestation, ...beaconAttestation[EntityMetaKey.Selector] }}
					<BeaconAttestationView
						selection={selection}
						prefetched={beaconAttestationFields}
						href={
							(beaconAttestationHrefFields.slot !== undefined && beaconAttestationHrefFields.indexInSlot !== undefined && beaconAttestationHrefFields.$network !== undefined && beaconAttestationHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
								slot: String(beaconAttestationHrefFields.slot ?? ''),
								index: String(beaconAttestationHrefFields.indexInSlot ?? ''),
								network: String(caip2StringFromValue(beaconAttestationHrefFields.$network.caip2) ?? ''),
							}) : beaconAttestationHrefFields.slot !== undefined && beaconAttestationHrefFields.indexInSlot !== undefined && beaconAttestationHrefFields.$network !== undefined && beaconAttestationHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
								slot: String(beaconAttestationHrefFields.slot ?? ''),
								index: String(beaconAttestationHrefFields.indexInSlot ?? ''),
								network: String(beaconAttestationHrefFields.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.BeaconAttestation}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
