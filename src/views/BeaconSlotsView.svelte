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
		title = 'Slots',
		typeAnnotationParagraphs = [],
		placeholderText = 'Loading Beacon slots...',
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BeaconSlots-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.BeaconSlot>
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
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
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
					slot: true,
					epoch: true,
				},
			}) : selection
		}
		{placeholderText}
	>
		{#snippet Pending()}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconSlot}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
			/>
		{/snippet}

		{#snippet children(beaconSlots)}
			{@const uniqueBeaconSlots = [...new Map(beaconSlots.values.map((beaconSlot) => [beaconSlot[EntityMetaKey.SelectorKey], beaconSlot])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.BeaconSlot}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={beaconSlots.values.length === uniqueBeaconSlots.length && beaconSlots.totalCount != null && beaconSlots.totalCount >= uniqueBeaconSlots.length ? beaconSlots.totalCount : uniqueBeaconSlots.length}
				getKey={(beaconSlot) => beaconSlot[EntityMetaKey.SelectorKey]}
				items={uniqueBeaconSlots}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Beacon slots yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: beaconSlot }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.BeaconSlot> })}
					<BeaconSlotView
						href={
							resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
								caip2: `${String(({ ...beaconSlot.entitySelector, ...beaconSlot }).$network.caip2.namespace)}:${String(({ ...beaconSlot.entitySelector, ...beaconSlot }).$network.caip2.reference)}`,
								slot: String(({ ...beaconSlot.entitySelector, ...beaconSlot }).slot),
							})
						}
						selection={select(EntityType.BeaconSlot, beaconSlot.entitySelector)}
						prefetched={beaconSlot}
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
		entityType={EntityType.BeaconSlot}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
