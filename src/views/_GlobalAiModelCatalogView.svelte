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
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
							{@const catalogId = pendingEntity.catalogId}
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
					{@const label = pendingEntity.label}
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
					{@const catalogKind = pendingEntity.catalogKind}
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
			<CollapsibleTabs
				id={viewDomId + '-carousel-ai-catalog-directory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-providers',
							label: 'Providers',
						},
						{
							id: 'ai-catalog-entries',
							label: 'Catalog entries',
						},
						{
							id: 'ai-models',
							label: 'Models',
						},
					]
				}
				data-card
				class='network-view-collapsible-directory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Providers and models</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiProviders({ id, label, open })}
					<AiModelProvidersView
						selection={selection.$$providers}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI model providers.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiCatalogEntries({ id, label, open })}
					<AiProviderCatalogEntriesView
						selection={selection.$$catalogEntries}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI provider catalog entries.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiModels({ id, label, open })}
					<AiModelsView
						selection={selection.$$models}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI models.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ai-catalog-eval'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-datasets',
							label: 'Datasets',
						},
						{
							id: 'ai-benchmarks',
							label: 'Benchmarks',
						},
						{
							id: 'ai-evaluations',
							label: 'Evaluations',
						},
					]
				}
				data-card
				class='network-view-collapsible-evaluation'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Datasets and evaluation</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiDatasets({ id, label, open })}
					<AiDatasetsView
						selection={selection.$$datasets}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI datasets.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiBenchmarks({ id, label, open })}
					<AiBenchmarksView
						selection={selection.$$benchmarks}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI benchmarks.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiEvaluations({ id, label, open })}
					<AiEvaluation_TimestampsView
						selection={selection.$$evaluations}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI evaluation observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ai-catalog-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-catalog-timestamps',
							label: 'Observations',
						},
					]
				}
				data-card
				class='network-view-collapsible-observations'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiCatalogTimestamps({ id, label, open })}
					<GlobalAiModelCatalog_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI model catalog observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
