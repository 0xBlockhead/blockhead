<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { UrlString } from '$/schema/UrlString.ts'


	// State
	let {
		selection,
		prefetched = {},
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.AcpAgentProgram>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AcpAgentProgram>>
			title?: string
			href?: string
			layout?: EntityLayout
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView>,
			| 'collapsible'
			| 'showTypeAnnotation'
		>
	> = $props()

	const pendingEntity = $derived(({ ...prefetched[EntityMetaKey.Selector], ...selection.entitySelector, ...prefetched }))
	const acpAgentProgram = $derived(selection({
		fields: {
			label: true,
		},
	}))
	const titleFallback = $derived([String((prefetched.label) ?? '')].filter(Boolean).join(' ') || [String((prefetched.registryAgentId) ?? ''), String((prefetched.packageName) ?? ''), String((prefetched.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'ACP agent program')
	const viewDomId = $derived('acp-agent-program-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
</script>


<EntityView
	entityType={EntityType.AcpAgentProgram}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={acpAgentProgram}>
			{#snippet Pending()}
				{[String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.registryAgentId) ?? ''), String((prefetched.packageName) ?? ''), String((prefetched.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={acpAgentProgram}>
			{#snippet Pending()}
				{[String((prefetched.packageName) ?? '')].filter(Boolean).join(' ') || [String((prefetched.label) ?? '')].filter(Boolean).join(' ') || title || [String((prefetched.registryAgentId) ?? ''), String((prefetched.packageName) ?? ''), String((prefetched.repositoryUrl) ?? '')].filter(Boolean).join(' ') || 'ACP agent program'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.packageName) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							registryAgentId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryAgentId = prefetched.registryAgentId}
					{#if registryAgentId !== undefined && registryAgentId !== null}
						<div>
							<dt>registry agent ID</dt>
							<dd>
								{String((registryAgentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryAgentId = resolvedEntity.registryAgentId}
					{#if registryAgentId !== undefined && registryAgentId !== null}
						<div>
							<dt>registry agent ID</dt>
							<dd>
								{String((registryAgentId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							packageName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const packageName = prefetched.packageName}
					{#if packageName !== undefined && packageName !== null}
						<div>
							<dt>package name</dt>
							<dd>
								{String((packageName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const packageName = resolvedEntity.packageName}
					{#if packageName !== undefined && packageName !== null}
						<div>
							<dt>package name</dt>
							<dd>
								{String((packageName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							repositoryUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const repositoryUrl = prefetched.repositoryUrl}
					{#if repositoryUrl !== undefined && repositoryUrl !== null}
						<div>
							<dt>repository URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(repositoryUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(repositoryUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const repositoryUrl = resolvedEntity.repositoryUrl}
					{#if repositoryUrl !== undefined && repositoryUrl !== null}
						<div>
							<dt>repository URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(repositoryUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(repositoryUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							label: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const label = prefetched.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const label = resolvedEntity.label}
					{#if label !== undefined && label !== null}
						<div>
							<dt>Label</dt>
							<dd>
								{String((label) ?? '')}
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
				{#snippet Pending()}
					{@const authors = prefetched.authors}
					{#if authors !== undefined && authors !== null}
						<div>
							<dt>authors</dt>
							<dd>
								{authors == null ? '' : String(((authors).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const authors = resolvedEntity.authors}
					{#if authors !== undefined && authors !== null}
						<div>
							<dt>authors</dt>
							<dd>
								{authors == null ? '' : String(((authors).join(', ')) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
