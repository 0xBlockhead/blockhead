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
		title = 'Epochs',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconEpochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.BeaconEpoch>
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
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
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
					epoch: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconEpoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				placeholderText={placeholderText}
			/>
		{/snippet}

		{#snippet children(beaconEpochs)}
			{@const uniqueBeaconEpochs = [...new Map(beaconEpochs.values.map((beaconEpoch) => [beaconEpoch[EntityMetaKey.SelectorKey], beaconEpoch])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconEpoch}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconEpochs.totalCount}
				getKey={(beaconEpoch) => beaconEpoch[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconEpochs}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon epochs yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconEpoch })}
					{@const beaconEpochFields = { ...beaconEpoch[EntityMetaKey.Selector], ...beaconEpoch }}
					{@const selection = select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
					{@const beaconEpochHrefFields = { ...beaconEpoch, ...beaconEpoch[EntityMetaKey.Selector] }}
					<BeaconEpochView
						selection={selection}
						prefetched={beaconEpochFields}
						href={
							(beaconEpochHrefFields.epoch !== undefined && beaconEpochHrefFields.$network !== undefined && beaconEpochHrefFields.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
								epoch: String(beaconEpochHrefFields.epoch ?? ''),
								network: String(caip2StringFromValue(beaconEpochHrefFields.$network.caip2) ?? ''),
							}) : beaconEpochHrefFields.epoch !== undefined && beaconEpochHrefFields.$network !== undefined && beaconEpochHrefFields.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/epoch/[epoch=nonNegativeInteger]', {
								epoch: String(beaconEpochHrefFields.epoch ?? ''),
								network: String(beaconEpochHrefFields.$network.slug ?? ''),
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
		entityType={EntityType.BeaconEpoch}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
