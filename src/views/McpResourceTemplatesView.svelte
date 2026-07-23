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
		title = 'MCP resource templates',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpResourceTemplates-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpResourceTemplate>
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
	entityType={EntityType.McpResourceTemplate}
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
				mimeType: true,
				name: true,
				uriTemplate: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mcpResourceTemplates) => [...new Map(mcpResourceTemplates.values.map((mcpResourceTemplate) => [mcpResourceTemplate[EntityMetaKey.SelectorKey], mcpResourceTemplate])).values()]}
	getKey={(mcpResourceTemplate) => mcpResourceTemplate[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Mcp resource templates yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpResourceTemplate })}
		{@const mcpResourceTemplateFields = { ...mcpResourceTemplate[EntityMetaKey.Selector], ...mcpResourceTemplate }}
		<EntityView
			entityType={EntityType.McpResourceTemplate}
			entitySelector={mcpResourceTemplate[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpResourceTemplateFields.title) ?? '')].filter(Boolean).join(' ') || [String((mcpResourceTemplateFields.name) ?? ''), String((mcpResourceTemplateFields.uriTemplate) ?? '')].filter(Boolean).join(' ') || 'mcp resource template'}
			{/snippet}

			{#snippet Value()}
				{[String((mcpResourceTemplateFields.mimeType) ?? '')].filter(Boolean).join(' ')}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
