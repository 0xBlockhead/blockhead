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
		title = 'Blockhead agent connection observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'BlockheadAgentConnection_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.BlockheadAgentConnection_Timestamp>
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
	entityType={EntityType.BlockheadAgentConnection_Timestamp}
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
				timestampMs: true,
				health: true,
				latencyMs: true,
			},
		})
	}
	{countResource}
	getResourceItems={(blockheadAgentConnectionTimestamps) => [...new Map(blockheadAgentConnectionTimestamps.values.map((blockheadAgentConnectionTimestamp) => [blockheadAgentConnectionTimestamp[EntityMetaKey.SelectorKey], blockheadAgentConnectionTimestamp])).values()]}
	getKey={(blockheadAgentConnectionTimestamp) => blockheadAgentConnectionTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Blockhead agent connection observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: blockheadAgentConnectionTimestamp })}
		{@const blockheadAgentConnectionTimestampFields = { ...blockheadAgentConnectionTimestamp[EntityMetaKey.Selector], ...blockheadAgentConnectionTimestamp }}
		<EntityView
			entityType={EntityType.BlockheadAgentConnection_Timestamp}
			entitySelector={blockheadAgentConnectionTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((blockheadAgentConnectionTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead agent connection timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((blockheadAgentConnectionTimestampFields.health) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((blockheadAgentConnectionTimestampFields.latencyMs) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
