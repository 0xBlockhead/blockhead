<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'Eigen layer slashing events',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerSlashingEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.EigenLayerSlashingEvent>
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
	import EigenLayerSlashingEventView from '$/views/EigenLayerSlashingEventView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.EigenLayerSlashingEvent}
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
				$operator: true,
				$avs: true,
				slashedShares: true,
			},
		})
	}
	getResourceItems={(eigenLayerSlashingEvents) => [...new Map(eigenLayerSlashingEvents.values.map((eigenLayerSlashingEvent) => [eigenLayerSlashingEvent[EntityMetaKey.SelectorKey], eigenLayerSlashingEvent])).values()]}
	getKey={(eigenLayerSlashingEvent) => eigenLayerSlashingEvent[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Eigen layer slashing events yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: eigenLayerSlashingEvent })}
		{@const eigenLayerSlashingEventFields = { ...eigenLayerSlashingEvent[EntityMetaKey.Selector], ...eigenLayerSlashingEvent }}
		{@const selection = select(EntityType.EigenLayerSlashingEvent, eigenLayerSlashingEvent[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<EigenLayerSlashingEventView
			selection={selection}
			prefetched={eigenLayerSlashingEventFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
