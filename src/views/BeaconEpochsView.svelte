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
		placeholderText,
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
			selection({
				fields: {
					epoch: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
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

				{#snippet Item({ item: beaconEpoch }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconEpoch> })}
					{@const beaconEpochFields = { ...beaconEpoch[EntityMetaKey.Selector], ...beaconEpoch }}
					{@const beaconEpochHrefFields = { ...beaconEpoch, ...beaconEpoch[EntityMetaKey.Selector] }}
					<BeaconEpochView
						selection={select(EntityType.BeaconEpoch, beaconEpoch[EntityMetaKey.Selector])}
						prefetched={beaconEpochFields}
						href={
							(beaconEpochHrefFields.$network !== undefined && beaconEpochHrefFields.$network.caip2 !== undefined && beaconEpochHrefFields.$network.caip2.namespace !== undefined && beaconEpochHrefFields.$network !== undefined && beaconEpochHrefFields.$network.caip2 !== undefined && beaconEpochHrefFields.$network.caip2.reference !== undefined && beaconEpochHrefFields.epoch !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/epoch/[epoch=nonNegativeInteger]', {
								caip2: `${String(beaconEpochHrefFields.$network.caip2.namespace ?? '')}:${String(beaconEpochHrefFields.$network.caip2.reference ?? '')}`,
								epoch: String(beaconEpochHrefFields.epoch ?? ''),
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
