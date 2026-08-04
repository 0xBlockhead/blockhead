<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntitiesList, { type EntityListViewProps } from '$/components/EntitiesList.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		title = 'MCP server package versions',
		open = $bindable(true),
		...EntitiesListProps
	}: EntityListViewProps<EntityType.McpServerPackageVersion> = $props()


	// Components
	import EntityView from '$/components/EntityView.svelte'
</script>


<EntitiesList
	{...EntitiesListProps}
	entityType={EntityType.McpServerPackageVersion}
	{title}
	bind:open
	resource={
		selection({
			fields: {
				version: true,
				$package: true,
				$artifact: true,
				registryStatus: true,
			},
		})
	}
>
	{#snippet Item({ item: mcpServerPackageVersion })}
		<EntityView
			entityType={EntityType.McpServerPackageVersion}
			entitySelector={mcpServerPackageVersion[EntityMetaKey.Selector]}
		>
			{#snippet Title()}
				{(mcpServerPackageVersion.version ?? '') || (mcpServerPackageVersion.$artifact == null ? '' : (mcpServerPackageVersion.$artifact.artifactType ?? '') || [(mcpServerPackageVersion.$artifact.providerArtifactId ?? ''), (mcpServerPackageVersion.$artifact.ociDigest ?? ''), (mcpServerPackageVersion.$artifact.ipfsCid ?? ''), (mcpServerPackageVersion.$artifact.arweaveId ?? ''), (mcpServerPackageVersion.$artifact.gitObject ?? ''), (mcpServerPackageVersion.$artifact.digest ?? '')].filter(Boolean).join(' ') || 'AI artifact') || 'mcp server package version'}
			{/snippet}

			{#snippet Value()}
				{mcpServerPackageVersion.$package == null ? '' : (mcpServerPackageVersion.$package.label ?? '') || [(mcpServerPackageVersion.$package.registryServerName ?? ''), (mcpServerPackageVersion.$package.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package'}
			{/snippet}

			{#snippet HeadingAfter()}
				<span data-text="annotation">{mcpServerPackageVersion.registryStatus ?? ''}</span>
			{/snippet}
		</EntityView>
	{/snippet}
</EntitiesList>
