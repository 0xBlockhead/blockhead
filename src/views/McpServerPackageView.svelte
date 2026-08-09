<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.McpServerPackage> = $props()

	const mcpServerPackage = $derived(selection({
		fields: {
			label: true,
			registryServerName: true,
			repositoryUrl: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || [(prefetched.registryServerName ?? ''), (prefetched.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.McpServerPackage}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'registryServerName' in selection.entitySelector ?
					resolve(
						'/mcp/package/registry/[registryServerName=stringSegment]',
						{
							registryServerName: selection.entitySelector.registryServerName,
						}
					)
				:
					'repositoryUrl' in selection.entitySelector ?
						resolve(
							'/mcp/package/repository/[repositoryUrl=absoluteUrl]',
							{
								repositoryUrl: encodeURIComponent(selection.entitySelector.repositoryUrl),
							}
						)
					:
						undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={mcpServerPackage}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={mcpServerPackage}
			>
				{#snippet children(entity)}
					{@const registryServerName = entity.registryServerName}
					{#if registryServerName != null}
						<div>
							<dt>registry server name</dt>
							<dd>
								{registryServerName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServerPackage}
			>
				{#snippet children(entity)}
					{@const repositoryUrl = entity.repositoryUrl}
					{#if repositoryUrl != null}
						<div>
							<dt>repository URL</dt>
							<dd>
								<a
									href={repositoryUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={repositoryUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={mcpServerPackage}
			>
				{#snippet children(entity)}
					{@const label = entity.label}
					{#if label != null}
						<div>
							<dt>Label</dt>
							<dd>
								{label}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
