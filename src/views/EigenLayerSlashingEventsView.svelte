<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntitiesListForwardProps } from '$/components/EntitiesList.svelte'
	import type { RegisteredEntityProxyEntitiesSelection } from '$/client/$proxy.svelte.ts'
	import type { SvelteKitResource } from '$/lib/db/queryResource.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'




	// State
	let {
		selection,
		countResource,
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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.EigenLayerSlashingEvent>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.EigenLayerSlashingEvent}
			entitySelector={eigenLayerSlashingEvent[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[[String((eigenLayerSlashingEventFields.$operator.operatorAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer operator'].filter(Boolean).join(' ') || 'eigen layer slashing event'}
			{/snippet}

			{#snippet Value()}
				{[[String((eigenLayerSlashingEventFields.$avs.avsAddress) ?? '')].filter(Boolean).join(' ') || 'eigen layer avs'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((eigenLayerSlashingEventFields.slashedShares) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
