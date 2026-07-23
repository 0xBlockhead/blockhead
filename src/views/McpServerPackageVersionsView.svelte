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
			selection: RegisteredEntityProxyEntitiesSelection<EntityType.McpServerPackageVersion>
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
	{countResource}
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
		<EntityView
			entityType={EntityType.McpServerPackageVersion}
			entitySelector={mcpServerPackageVersion[EntityMetaKey.Selector]}
			layout={EntityLayout.Summary}
			open={false}
			showTypeAnnotation={false}
		>
			{#snippet Title()}
				{[String((mcpServerPackageVersionFields.version) ?? '')].filter(Boolean).join(' ') || [[String((mcpServerPackageVersionFields.$artifact.artifactType) ?? '')].filter(Boolean).join(' ') || [String((mcpServerPackageVersionFields.$artifact.providerArtifactId) ?? ''), String((mcpServerPackageVersionFields.$artifact.ociDigest) ?? ''), String((mcpServerPackageVersionFields.$artifact.ipfsCid) ?? ''), String((mcpServerPackageVersionFields.$artifact.arweaveId) ?? ''), String((mcpServerPackageVersionFields.$artifact.gitObject) ?? ''), String((mcpServerPackageVersionFields.$artifact.digest) ?? '')].filter(Boolean).join(' ') || 'AI artifact'].filter(Boolean).join(' ') || 'mcp server package version'}
			{/snippet}

			{#snippet Value()}
				{[[String((mcpServerPackageVersionFields.$package.label) ?? '')].filter(Boolean).join(' ') || [String((mcpServerPackageVersionFields.$package.registryServerName) ?? ''), String((mcpServerPackageVersionFields.$package.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'MCP server package'].filter(Boolean).join(' ')}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{[String((mcpServerPackageVersionFields.registryStatus) ?? '')].filter(Boolean).join(' ')}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
