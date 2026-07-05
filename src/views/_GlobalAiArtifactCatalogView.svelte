<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiArtifactCatalog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalAiArtifactCatalog>>
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
	const globalAiArtifactCatalog = $derived(selection({}))
	const titleFallback = $derived('global AI artifact catalog')
	const viewDomId = $derived('-global-ai-artifact-catalog-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiArtifactsView from '$/views/AiArtifactsView.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import GlobalAiArtifactCatalog_TimestampsView from '$/views/_GlobalAiArtifactCatalog_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiArtifactCatalog}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalAiArtifactCatalog}>
			{#snippet Pending()}
				{title || 'global AI artifact catalog'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									catalogId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const catalogId = selection.entitySelector.catalogId ?? prefetched.catalogId}
							{#if catalogId !== undefined && catalogId !== null}
								{String((catalogId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const catalogId = resolvedEntity.catalogId}
							{#if catalogId !== undefined && catalogId !== null}
								{String((catalogId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

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
							catalogKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const catalogKind = prefetched.catalogKind}
					{#if catalogKind !== undefined && catalogKind !== null}
						<div>
							<dt>catalog kind</dt>
							<dd>
								{String((catalogKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const catalogKind = resolvedEntity.catalogKind}
					{#if catalogKind !== undefined && catalogKind !== null}
						<div>
							<dt>catalog kind</dt>
							<dd>
								{String((catalogKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiArtifactsView
				selection={selection[EntityProxyField]<EntityType.AiArtifact>('$$artifacts')}
				title='artifacts'
				emptyText='No AI artifacts.'
				id='AiArtifactsView-$$artifacts'
			/>

			<AiDocumentsView
				selection={selection[EntityProxyField]<EntityType.AiDocument>('$$documents')}
				title='documents'
				emptyText='No AI documents.'
				id='AiDocumentsView-$$documents'
			/>

			<GlobalAiArtifactCatalog_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalAiArtifactCatalog_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No AI artifact catalog observations.'
				id='_GlobalAiArtifactCatalog_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
