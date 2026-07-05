<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { SubscribeEntityReferenceResult } from '$/client/$client.svelte.ts'
	import type { EntityProxyEntitiesResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title = 'MCP server packages',
		typeAnnotationParagraphs = [],
		placeholderText,
		emptyText = undefined,
		open = $bindable(true),
		collapsible = true,
		showTypeAnnotation = true,
		id = 'McpServerPackages-list',
		...EntitiesListProps
	}: WithRest<
		{
			selection: EntityProxyEntitiesResource<typeof schema, EntityType.McpServerPackage>
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


	// Components
	import EntitiesList from '$/components/EntitiesList.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import McpServerPackageView from '$/views/McpServerPackageView.svelte'
</script>


{#snippet TypeAnnotationParagraphs()}
	{#each typeAnnotationParagraphs as paragraph (paragraph)}
		<p>{paragraph}</p>
	{/each}
{/snippet}

{#if open}
	<ResourceBoundary
		resource={
			selection({
				fields: {
					label: true,
					registryServerName: true,
					repositoryUrl: true,
				},
			})
		}
		{placeholderText}
	>
		{#snippet children(mcpServerPackages)}
			{@const uniqueMcpServerPackages = [...new Map(mcpServerPackages.values.map((mcpServerPackage) => [mcpServerPackage[EntityMetaKey.SelectorKey], mcpServerPackage])).values()]}
			<EntitiesList
				{...EntitiesListProps}
				entityType={EntityType.McpServerPackage}
				{id}
				{title}
				bind:open
				{collapsible}
				{showTypeAnnotation}
				TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
				totalCount={mcpServerPackages.totalCount}
				getKey={(mcpServerPackage) => mcpServerPackage[EntityMetaKey.SelectorKey]}
				items={uniqueMcpServerPackages}
			>
				{#snippet Empty()}
					{#if emptyText != null}
						<p data-text="muted">{emptyText}</p>
					{:else}
						<p data-text="muted">No MCP server packages yet.</p>
					{/if}
				{/snippet}

				{#snippet Item({ item: mcpServerPackage }: { item: SubscribeEntityReferenceResult<typeof schema, EntityType.McpServerPackage> })}
					{@const mcpServerPackageFields = { ...mcpServerPackage[EntityMetaKey.Selector], ...mcpServerPackage }}
					<McpServerPackageView
						selection={select(EntityType.McpServerPackage, mcpServerPackage[EntityMetaKey.Selector])}
						prefetched={mcpServerPackageFields}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/snippet}
			</EntitiesList>
		{/snippet}
	</ResourceBoundary>
{:else}
	<EntitiesList
		{...EntitiesListProps}
		entityType={EntityType.McpServerPackage}
		{id}
		{title}
		bind:open
		{collapsible}
		{showTypeAnnotation}
		TypeAnnotationTooltip={typeAnnotationParagraphs.length > 0 ? TypeAnnotationParagraphs : undefined}
	/>
{/if}
