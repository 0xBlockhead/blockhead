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
		placeholderText,
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
			selection({
				fields: {
					slot: true,
					$epoch: true,
					$network: true,
				},
			})
		}
		{placeholderText}
	>
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
				totalCount={beaconSlots.totalCount}
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
					{@const beaconSlotFields = { ...beaconSlot[EntityMetaKey.Selector], ...beaconSlot }}
					{@const beaconSlotHrefFields = { ...beaconSlot, ...beaconSlot[EntityMetaKey.Selector] }}
					<BeaconSlotView
						selection={select(EntityType.BeaconSlot, beaconSlot[EntityMetaKey.Selector])}
						prefetched={beaconSlotFields}
						href={
							(beaconSlotHrefFields.$network !== undefined && beaconSlotHrefFields.$network.caip2 !== undefined && beaconSlotHrefFields.$network.caip2.namespace !== undefined && beaconSlotHrefFields.$network !== undefined && beaconSlotHrefFields.$network.caip2 !== undefined && beaconSlotHrefFields.$network.caip2.reference !== undefined && beaconSlotHrefFields.slot !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/slot/[slot=nonNegativeInteger]', {
								caip2: `${String(beaconSlotHrefFields.$network.caip2.namespace ?? '')}:${String(beaconSlotHrefFields.$network.caip2.reference ?? '')}`,
								slot: String(beaconSlotHrefFields.slot ?? ''),
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
		entityType={EntityType.BeaconSlot}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
