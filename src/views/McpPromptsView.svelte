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
		title = 'MCP prompts',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpPrompts-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpPrompt>
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
	entityType={EntityType.McpPrompt}
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
				title: true,
				$server: {
					fields: {
						transportKind: true,
						endpointUrl: true,
					},
				},
				name: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mcpPrompts) => [...new Map(mcpPrompts.values.map((mcpPrompt) => [mcpPrompt[EntityMetaKey.SelectorKey], mcpPrompt])).values()]}
	getKey={(mcpPrompt) => mcpPrompt[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Mcp prompts yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpPrompt })}
		{@const mcpPromptFields = { ...mcpPrompt[EntityMetaKey.Selector], ...mcpPrompt }}
		<EntityView
			entityType={EntityType.McpPrompt}
			entitySelector={mcpPrompt[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpPromptFields.title) ?? '')].filter(Boolean).join(' ') || [String((mcpPromptFields.name) ?? '')].filter(Boolean).join(' ') || 'mcp prompt'}
			{/snippet}

			{#snippet Value()}
				{[[String((mcpPromptFields.$server.serverKey) ?? '')].filter(Boolean).join(' ') || 'mcp server'].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
