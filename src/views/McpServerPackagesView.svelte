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
		title = 'MCP server packages',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpServerPackages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpServerPackage>
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
	entityType={EntityType.McpServerPackage}
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
				label: true,
				registryServerName: true,
				repositoryUrl: true,
			},
		})
	}
	{countResource}
	getResourceItems={(mcpServerPackages) => [...new Map(mcpServerPackages.values.map((mcpServerPackage) => [mcpServerPackage[EntityMetaKey.SelectorKey], mcpServerPackage])).values()]}
	getKey={(mcpServerPackage) => mcpServerPackage[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No MCP server packages yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpServerPackage })}
		{@const mcpServerPackageFields = { ...mcpServerPackage[EntityMetaKey.Selector], ...mcpServerPackage }}
		<EntityView
			entityType={EntityType.McpServerPackage}
			entitySelector={mcpServerPackage[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpServerPackageFields.label) ?? '')].filter(Boolean).join(' ') || [String((mcpServerPackageFields.registryServerName) ?? ''), String((mcpServerPackageFields.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'MCP server package'}
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
