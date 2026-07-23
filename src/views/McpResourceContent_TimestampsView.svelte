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
		title = 'MCP resource content observations',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpResourceContent_Timestamps-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpResourceContent_Timestamp>
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
	entityType={EntityType.McpResourceContent_Timestamp}
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
				contentKind: true,
				mimeType: true,
				error: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mcpResourceContentTimestamps) => [...new Map(mcpResourceContentTimestamps.values.map((mcpResourceContentTimestamp) => [mcpResourceContentTimestamp[EntityMetaKey.SelectorKey], mcpResourceContentTimestamp])).values()]}
	getKey={(mcpResourceContentTimestamp) => mcpResourceContentTimestamp[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Mcp resource content observations yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpResourceContentTimestamp })}
		{@const mcpResourceContentTimestampFields = { ...mcpResourceContentTimestamp[EntityMetaKey.Selector], ...mcpResourceContentTimestamp }}
		<EntityView
			entityType={EntityType.McpResourceContent_Timestamp}
			entitySelector={mcpResourceContentTimestamp[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpResourceContentTimestampFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'mcp resource content timestamp'}
			{/snippet}

			{#snippet Value()}
				{[String((mcpResourceContentTimestampFields.contentKind) ?? ''), String((mcpResourceContentTimestampFields.mimeType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((mcpResourceContentTimestampFields.error) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
