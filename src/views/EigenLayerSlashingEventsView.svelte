<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
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
		title = 'Eigen layer slashing events',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'EigenLayerSlashingEvents-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.EigenLayerSlashingEvent>
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
	import EigenLayerSlashingEventView from '$/views/EigenLayerSlashingEventView.svelte'
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
					$operator: true,
					$avs: true,
					slashedShares: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(eigenLayerSlashingEvents)}
			{@const uniqueEigenLayerSlashingEvents = [...new Map(eigenLayerSlashingEvents.values.map((eigenLayerSlashingEvent) => [eigenLayerSlashingEvent[EntityMetaKey.SelectorKey], eigenLayerSlashingEvent])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.EigenLayerSlashingEvent}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={eigenLayerSlashingEvents.totalCount}
				getKey={(eigenLayerSlashingEvent) => eigenLayerSlashingEvent[EntityMetaKey.SelectorKey]}
				items={uniqueEigenLayerSlashingEvents}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No Eigen layer slashing events yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: eigenLayerSlashingEvent }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.EigenLayerSlashingEvent> })}
					{@const eigenLayerSlashingEventFields = { ...eigenLayerSlashingEvent[EntityMetaKey.Selector], ...eigenLayerSlashingEvent }}
					<EigenLayerSlashingEventView
						selection={select(EntityType.EigenLayerSlashingEvent, eigenLayerSlashingEvent[EntityMetaKey.Selector])}
						prefetched={eigenLayerSlashingEventFields}
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
		entityType={EntityType.EigenLayerSlashingEvent}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
