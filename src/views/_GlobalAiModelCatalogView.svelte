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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiModelCatalog>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalAiModelCatalog>>
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
	const globalAiModelCatalog = $derived(selection({}))
	const titleFallback = $derived('global AI model catalog')
	const viewDomId = $derived('-global-ai-model-catalog-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiModelProvidersView from '$/views/AiModelProvidersView.svelte'
	import AiProviderCatalogEntriesView from '$/views/AiProviderCatalogEntriesView.svelte'
	import AiModelsView from '$/views/AiModelsView.svelte'
	import AiDatasetsView from '$/views/AiDatasetsView.svelte'
	import AiBenchmarksView from '$/views/AiBenchmarksView.svelte'
	import AiEvaluation_TimestampsView from '$/views/AiEvaluation_TimestampsView.svelte'
	import GlobalAiModelCatalog_TimestampsView from '$/views/_GlobalAiModelCatalog_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiModelCatalog}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalAiModelCatalog}>
			{#snippet Pending()}
				{title || 'global AI model catalog'}
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
			<AiModelProvidersView
				selection={selection[EntityProxyField]<EntityType.AiModelProvider>('$$providers')}
				title='providers'
				emptyText='No AI model providers.'
				id='AiModelProvidersView-$$providers'
			/>

			<AiProviderCatalogEntriesView
				selection={selection[EntityProxyField]<EntityType.AiProviderCatalogEntry>('$$catalogEntries')}
				title='catalog entries'
				emptyText='No AI provider catalog entries.'
				id='AiProviderCatalogEntriesView-$$catalogEntries'
			/>

			<AiModelsView
				selection={selection[EntityProxyField]<EntityType.AiModel>('$$models')}
				title='models'
				emptyText='No AI models.'
				id='AiModelsView-$$models'
			/>

			<AiDatasetsView
				selection={selection[EntityProxyField]<EntityType.AiDataset>('$$datasets')}
				title='datasets'
				emptyText='No AI datasets.'
				id='AiDatasetsView-$$datasets'
			/>

			<AiBenchmarksView
				selection={selection[EntityProxyField]<EntityType.AiBenchmark>('$$benchmarks')}
				title='benchmarks'
				emptyText='No AI benchmarks.'
				id='AiBenchmarksView-$$benchmarks'
			/>

			<AiEvaluation_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AiEvaluation_Timestamp>('$$evaluations')}
				title='evaluations'
				emptyText='No AI evaluation observations.'
				id='AiEvaluation_TimestampsView-$$evaluations'
			/>

			<GlobalAiModelCatalog_TimestampsView
				selection={selection[EntityProxyField]<EntityType._GlobalAiModelCatalog_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No AI model catalog observations.'
				id='_GlobalAiModelCatalog_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
