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
		title = 'Blockhead Radicle seed observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadRadicleSeedObservation_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadRadicleSeedObservation_Timestamp>
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
	entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
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
				nodeId: true,
				timestampMs: true,
				$repository: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadRadicleSeedObservationTimestamps) => [...new Map(blockheadRadicleSeedObservationTimestamps.values.map((blockheadRadicleSeedObservationTimestamp) => [blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey], blockheadRadicleSeedObservationTimestamp])).values()]}
	getKey={(blockheadRadicleSeedObservationTimestamp) => blockheadRadicleSeedObservationTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead radicle seed observation observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadRadicleSeedObservationTimestamp })}
		{@const blockheadRadicleSeedObservationTimestampFields = { ...blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector], ...blockheadRadicleSeedObservationTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadRadicleSeedObservation_Timestamp}
			entitySelector={blockheadRadicleSeedObservationTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadRadicleSeedObservationTimestampFields.nodeId) ?? '')].filter(Boolean).join(' ') || 'blockhead radicle seed observation timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadRadicleSeedObservationTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{['radicle repository'].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
