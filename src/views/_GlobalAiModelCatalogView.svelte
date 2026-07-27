<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalAiModelCatalog> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const titleFallback = 'global AI model catalog'
	const viewDomId = $derived('-global-ai-model-catalog-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		global AI model catalog
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog ID</dt>
				<dd>
					{pendingEntity.catalogId}
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
							catalogKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const catalogKind = entity.catalogKind}
					{#if catalogKind != null}
						<div>
							<dt>catalog kind</dt>
							<dd>
								{catalogKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Providers and models</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiProviders({ id, label, open })}
				<AiModelProvidersView
					selection={selection.$$providers}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI model providers.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiCatalogEntries({ id, label, open })}
				<AiProviderCatalogEntriesView
					selection={selection.$$catalogEntries}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI provider catalog entries.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiModels({ id, label, open })}
				<AiModelsView
					selection={selection.$$models}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI models.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Datasets and evaluation</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiDatasets({ id, label, open })}
				<AiDatasetsView
					selection={selection.$$datasets}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI datasets.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiBenchmarks({ id, label, open })}
				<AiBenchmarksView
					selection={selection.$$benchmarks}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI benchmarks.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiEvaluations({ id, label, open })}
				<AiEvaluation_TimestampsView
					selection={selection.$$evaluations}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI evaluation observations.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiCatalogTimestamps({ id, label, open })}
				<GlobalAiModelCatalog_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI model catalog observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
