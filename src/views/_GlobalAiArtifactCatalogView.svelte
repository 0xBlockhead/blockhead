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
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
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
				id={viewDomId + '-carousel-ai-artifact-catalog-inventory'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-artifact-catalog-artifacts',
							label: 'Artifacts',
						},
						{
							id: 'ai-artifact-catalog-documents',
							label: 'Documents',
						},
					]
				}
				data-card
				class='network-view-collapsible-inventory'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Artifacts and documents</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiArtifactCatalogArtifacts({ id, label, open })}
					<AiArtifactsView
						selection={
							selection.$$artifacts({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI artifacts.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiArtifactCatalogDocuments({ id, label, open })}
					<AiDocumentsView
						selection={
							selection.$$documents({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI documents.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ai-artifact-catalog-observations'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-artifact-catalog-timestamps',
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

				{#snippet SectionAiArtifactCatalogTimestamps({ id, label, open })}
					<GlobalAiArtifactCatalog_TimestampsView
						selection={
							selection.$$timestamps({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI artifact catalog observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
