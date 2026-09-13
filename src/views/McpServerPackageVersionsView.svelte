<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		{@const mcpServerPackageVersionSelector = mcpServerPackageVersion[EntityMetaKey.Selector]}
		{@const artifact = mcpServerPackageVersionSelector.$artifact}
		<EntityView
			entityType={EntityType.McpServerPackageVersion}
			entitySelector={mcpServerPackageVersionSelector}
			href={
				artifact !== undefined
				&& artifact.providerArtifactId !== undefined
				&& artifact.$provider !== undefined
				&& artifact.$provider.providerId !== undefined ?
					resolve(
						'/(ai)/ai/provider/id/[providerId=stringSegment]/(aiModelProvider)/artifact/[providerArtifactId=stringSegment]/(aiArtifact)/mcp-package-version',
						{
							providerId: artifact.$provider.providerId,
							providerArtifactId: artifact.providerArtifactId,
						}
					)
				:
					mcpServerPackageVersionSelector.version !== undefined
					&& mcpServerPackageVersionSelector.$package !== undefined
					&& mcpServerPackageVersionSelector.$package.registryServerName !== undefined ?
						resolve(
							'/mcp/package/registry/[registryServerName=stringSegment]/(mcpServerPackage)/version/[version=stringSegment]',
							{
								registryServerName: encodeURIComponent(mcpServerPackageVersionSelector.$package.registryServerName),
								version: mcpServerPackageVersionSelector.version,
							}
						)
					:
						undefined
			}
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
