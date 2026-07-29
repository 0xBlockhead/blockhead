<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.AiModel> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Anthropic_Rest,
			Source.HuggingFaceHub_Rest,
			Source.Mlflow_Rest,
			Source.OpenAI_Rest,
		],
	}))
	const aiModel = $derived(viewSelection({
		fields: {
			label: true,
			modelFamily: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || selection.entitySelector.providerModelId || 'AI model')
	const viewDomId = $derived('ai-model-' + encodeURIComponent(stringify(selection.entitySelector)))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
	import AiModelVersionsView from '$/views/AiModelVersionsView.svelte'
	import AiDocumentsView from '$/views/AiDocumentsView.svelte'
	import AiModel_TimestampsView from '$/views/AiModel_TimestampsView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModel}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiModel}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<AiModelProviderView
			selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiModel}>
			{#snippet children(entity)}
				{@const modelFamily = entity.modelFamily}
				{#if modelFamily != null}
					<span data-text="muted">
						{modelFamily}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>provider</dt>
				<dd>
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>provider model ID</dt>
				<dd>
					{selection.entitySelector.providerModelId}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerResourceName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerResourceName = entity.providerResourceName}
					{#if providerResourceName != null}
						<div>
							<dt>provider resource name</dt>
							<dd>
								{providerResourceName}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							baseModelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseModelId = entity.baseModelId}
					{#if baseModelId != null}
						<div>
							<dt>base model ID</dt>
							<dd>
								{baseModelId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModel}
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
				resource={aiModel}
			>
				{#snippet children(entity)}
					{@const modelFamily = entity.modelFamily}
					{#if modelFamily != null}
						<div>
							<dt>model family</dt>
							<dd>
								{modelFamily}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerOwnedBy = entity.providerOwnedBy}
					{#if providerOwnedBy != null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{providerOwnedBy}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							providerCreatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const providerCreatedAt = entity.providerCreatedAt}
					{#if providerCreatedAt != null}
						<div>
							<dt>provider created AT</dt>
							<dd>
								<Timestamp timestamp={providerCreatedAt} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		<CollapsibleTabs
			id={viewDomId + '-carousel-ai-model-versions-docs'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ai-model-versions',
						label: 'Versions',
					},
					{
						id: 'ai-model-documents',
						label: 'Documents',
					},
				]
			}
			data-card
			class='network-view-collapsible-versions'
		>
			{#snippet Summary()}
				<header data-row-item="flexible" data-row="wrap gap-4">
					<HeadingComponent>Versions and documents</HeadingComponent>
				</header>
			{/snippet}

			{#snippet SectionAiModelVersions({ id, label, open })}
				<AiModelVersionsView
					selection={selection.$$versions}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI model versions.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiModelDocuments({ id, label, open })}
				<AiDocumentsView
					selection={selection.$$documents}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No linked documents.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>

		<CollapsibleTabs
			id={viewDomId + '-carousel-ai-model-observations'}
			sectionIdPrefix={viewDomId}
			sections={
				[
					{
						id: 'ai-model-timestamps',
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

			{#snippet SectionAiModelTimestamps({ id, label, open })}
				<AiModel_TimestampsView
					selection={selection.$$timestamps}
					CollapsibleProps={{ canToggle: false }}
					collapsible={false}
					data-column-item="flexible"
					data-card
					data-scroll-container
					open={open}
					title={label}
					emptyText='No AI model observations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
