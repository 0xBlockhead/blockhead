<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.McpServerPackage> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const mcpServerPackage = $derived(selection({
		fields: {
			label: true,
			registryServerName: true,
			repositoryUrl: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || [(pendingEntity.registryServerName ?? ''), String(pendingEntity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'MCP server package')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.McpServerPackage}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
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

	{#snippet Content({ open: contentOpen })}
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
									href={String(repositoryUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(repositoryUrl)} />
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
