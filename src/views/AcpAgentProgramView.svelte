<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
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
				{(entity.packageName ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={acpAgentProgram}
			>
				{#snippet children(entity)}
					{@const registryAgentId = entity.registryAgentId}
					{#if registryAgentId != null}
						<div>
							<dt>registry agent ID</dt>
							<dd>
								{registryAgentId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={acpAgentProgram}
			>
				{#snippet children(entity)}
					{@const packageName = entity.packageName}
					{#if packageName != null}
						<div>
							<dt>package name</dt>
							<dd>
								{packageName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={acpAgentProgram}
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
