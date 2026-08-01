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
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType._GlobalAiArtifactCatalog> = $props()

	const viewDomId = $derived('-global-ai-artifact-catalog-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog ID</dt>
				<dd>
					{selection.entitySelector.catalogId}
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Artifacts and documents</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiArtifactCatalogArtifacts({ id, label, open })}
				<AiArtifactsView
					selection={selection.$$artifacts}
					collapsible={false}
					title={label}
					emptyText='No AI artifacts.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiArtifactCatalogDocuments({ id, label, open })}
				<AiDocumentsView
					selection={selection.$$documents}
					collapsible={false}
					title={label}
					emptyText='No AI documents.'
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
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Observations</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiArtifactCatalogTimestamps({ id, label, open })}
				<GlobalAiArtifactCatalog_TimestampsView
					selection={selection.$$timestamps}
					collapsible={false}
					title={label}
					emptyText='No AI artifact catalog observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
