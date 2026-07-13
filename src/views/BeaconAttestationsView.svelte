<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Attestations',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconAttestations-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconAttestation>
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

				{#snippet Item({ item: beaconAttestation }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconAttestation> })}
					{@const beaconAttestationFields = { ...beaconAttestation[EntityMetaKey.Selector], ...beaconAttestation }}
					{@const beaconAttestationHrefFields = { ...beaconAttestation, ...beaconAttestation[EntityMetaKey.Selector] }}
					<BeaconAttestationView
						selection={select(EntityType.BeaconAttestation, beaconAttestation[EntityMetaKey.Selector], { sources: selection.sources })}
						prefetched={beaconAttestationFields}
						href={
							(beaconAttestationHrefFields.$network !== undefined && beaconAttestationHrefFields.$network.slug !== undefined && beaconAttestationHrefFields.slot !== undefined && beaconAttestationHrefFields.indexInSlot !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/slot/[slot=nonNegativeInteger]/attestation/[index=nonNegativeInteger]', {
								network: String(beaconAttestationHrefFields.$network.slug ?? ''),
								slot: String(beaconAttestationHrefFields.slot ?? ''),
								index: String(beaconAttestationHrefFields.indexInSlot ?? ''),
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
