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
	}: EntitySelectionViewProps<EntityType.AcpAgentProgram> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const acpAgentProgram = $derived(selection({
		fields: {
			label: true,
			packageName: true,
			registryAgentId: true,
			repositoryUrl: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.label ?? '') || [(pendingEntity.registryAgentId ?? ''), (pendingEntity.packageName ?? ''), String(pendingEntity.repositoryUrl ?? '')].filter(Boolean).join(' ') || 'ACP agent program')


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

	{#snippet Content({ open: contentOpen })}
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
					selection({
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
