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
			selection: RegisteredEntityProxyEntitiesResource<EntityType.McpResourceContent_Timestamp>
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
	import McpResourceContent_TimestampView from '$/views/McpResourceContent_TimestampView.svelte'
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
		{@const selection = select(EntityType.McpResourceContent_Timestamp, mcpResourceContentTimestamp[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<McpResourceContent_TimestampView
			selection={selection}
			prefetched={mcpResourceContentTimestampFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
