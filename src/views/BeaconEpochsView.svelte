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
		title = 'Epochs',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Beacon epochs...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconEpochs-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconEpoch>
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
			selection.sources == null ? selection({
				fields: {
					epoch: true,
				},
			}) : selection
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
				totalCount={beaconEpochs.values.length === uniqueBeaconEpochs.length && beaconEpochs.totalCount != null && beaconEpochs.totalCount >= uniqueBeaconEpochs.length ? beaconEpochs.totalCount : uniqueBeaconEpochs.length}
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

				{#snippet Item({ item: beaconEpoch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconEpoch> })}
					<BeaconEpochView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconEpoch.entitySelector, ...beaconEpoch }).$network.caip2.namespace)}:${String(({ ...beaconEpoch.entitySelector, ...beaconEpoch }).$network.caip2.reference)}`,
								epoch: String(({ ...beaconEpoch.entitySelector, ...beaconEpoch }).epoch),
							})
						}
						selection={select(EntityType.BeaconEpoch, beaconEpoch.entitySelector)}
						prefetched={beaconEpoch}
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
