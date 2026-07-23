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
		title = 'MCP prompt results',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpPromptResults-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpPromptResult>
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
	entityType={EntityType.McpPromptResult}
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
				$prompt: {
					fields: {
						title: true,
						$server: {
							fields: {
								transportKind: true,
								endpointUrl: true,
							},
						},
					},
				},
				error: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mcpPromptResults) => [...new Map(mcpPromptResults.values.map((mcpPromptResult) => [mcpPromptResult[EntityMetaKey.SelectorKey], mcpPromptResult])).values()]}
	getKey={(mcpPromptResult) => mcpPromptResult[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Mcp prompt results yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpPromptResult })}
		{@const mcpPromptResultFields = { ...mcpPromptResult[EntityMetaKey.Selector], ...mcpPromptResult }}
		<EntityView
			entityType={EntityType.McpPromptResult}
			entitySelector={mcpPromptResult[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpPromptResultFields.timestampMs) ?? '')].filter(Boolean).join(' ') || 'mcp prompt result'}
			{/snippet}

			{#snippet Value()}
				{[[String((mcpPromptResultFields.$prompt.title) ?? '')].filter(Boolean).join(' ') || [String((mcpPromptResultFields.$prompt.name) ?? '')].filter(Boolean).join(' ') || 'mcp prompt'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((mcpPromptResultFields.error) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
