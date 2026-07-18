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
		title = 'MCP server package versions',
		typeAnnotationParagraphs = [],
		placeholderText = undefined,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpServerPackageVersions-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: RegisteredEntityProxyEntitiesResource<EntityType.McpServerPackageVersion>
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
	import McpServerPackageVersionView from '$/views/McpServerPackageVersionView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpServerPackageVersion}
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
				version: true,
				$package: true,
				$artifact: true,
				registryStatus: true,
			},
		})
	}
	getResourceItems={(mcpServerPackageVersions) => [...new Map(mcpServerPackageVersions.values.map((mcpServerPackageVersion) => [mcpServerPackageVersion[EntityMetaKey.SelectorKey], mcpServerPackageVersion])).values()]}
	getKey={(mcpServerPackageVersion) => mcpServerPackageVersion[EntityMetaKey.SelectorKey]}
	{placeholderText}
>
	{#snippet Empty()}
		{#if emptyText != null}
			<p data-text="muted">{emptyText}</p>
		{:else}
			<p data-text="muted">No Mcp server package versions yet.</p>
		{/if}
	{/snippet}

	{#snippet Item({ item: mcpServerPackageVersion })}
		{@const mcpServerPackageVersionFields = { ...mcpServerPackageVersion[EntityMetaKey.Selector], ...mcpServerPackageVersion }}
		{@const selection = select(EntityType.McpServerPackageVersion, mcpServerPackageVersion[EntityMetaKey.Selector], { sources: collectionSelection.sources })}
		<McpServerPackageVersionView
			selection={selection}
			prefetched={mcpServerPackageVersionFields}
			layout={EntityLayout.Summary}
			open={false}
		/>
	{/snippet}
</EntitiesList>
