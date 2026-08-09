<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AcpAgentProgram> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.AcpRegistry_Rest,
		],
	}))
	const acpAgentProgram = $derived(viewSelection({
		fields: {
			label: true,
			packageName: true,
			registryAgentId: true,
			repositoryUrl: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || [(prefetched.registryAgentId ?? ''), (prefetched.packageName ?? ''), (prefetched.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program')


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.AcpAgentProgram}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			(
				'registryAgentId' in selection.entitySelector ?
					resolve(
						'/(agents)/agents/acp/program/registry/[registryAgentId=stringSegment]',
						{
							registryAgentId: selection.entitySelector.registryAgentId,
						}
					)
				:
					'packageName' in selection.entitySelector ?
						resolve(
							'/(agents)/agents/acp/program/package/[packageName=stringSegment]',
							{
								packageName: selection.entitySelector.packageName,
							}
						)
					:
						'repositoryUrl' in selection.entitySelector ?
							resolve(
								'/(agents)/agents/acp/program/repository/[repositoryUrl=absoluteUrl]',
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
		<ResourceBoundary resource={acpAgentProgram}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpAgentProgram}>
			{#snippet children(entity)}
				{entity.packageName || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>registry agent ID</dt>
				<dd>
					<ResourceBoundary
						resource={acpAgentProgram}
					>
						{#snippet children(entity)}
							{entity.registryAgentId}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>package name</dt>
				<dd>
					<ResourceBoundary
						resource={acpAgentProgram}
					>
						{#snippet children(entity)}
							{entity.packageName}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>repository URL</dt>
				<dd>
					<ResourceBoundary
						resource={acpAgentProgram}
					>
						{#snippet children(entity)}
							<a
								href={entity.repositoryUrl}
								target="_blank"
								rel="noreferrer noopener"
							>
								<TruncatedValue value={entity.repositoryUrl} />
							</a>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={acpAgentProgram}
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

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							authors: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const authors = entity.authors}
					{#if authors != null}
						<div>
							<dt>authors</dt>
							<dd>
								{authors.join(', ')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
