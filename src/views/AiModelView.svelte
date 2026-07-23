<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


	// Context
	import { select } from '$/routes/+layout.svelte'


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
			selection: RegisteredEntityProxyResource<EntityType.AiModel>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiModel>
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
	const aiModel = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			label: true,
			modelFamily: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			label: true,
			modelFamily: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model')
	const viewDomId = $derived('ai-model-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$provider') && prefetched.$provider != null && Object.hasOwn(prefetched.$provider, 'label') && Object.hasOwn(prefetched.$provider, 'organizationKind') && Object.hasOwn(prefetched.$provider, 'providerId') && Object.hasOwn(prefetched.$provider, 'domain') && Object.hasOwn(prefetched, 'modelFamily')}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$provider') && prefetched.$provider != null && Object.hasOwn(prefetched.$provider, 'label') && Object.hasOwn(prefetched.$provider, 'organizationKind') && Object.hasOwn(prefetched.$provider, 'providerId') && Object.hasOwn(prefetched.$provider, 'domain') && Object.hasOwn(prefetched, 'modelFamily')}
			{@const aiModelProvider0 = pendingEntity.$provider}
			{#if aiModelProvider0 != null && selection.entitySelector.$provider != null}
				<AiModelProviderView
					selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider, { sources: selection.sources })}
					prefetched={aiModelProvider0}
					href=""
					layout={EntityLayout.Value}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={aiModel}>
				{#snippet children(entity)}
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
						href=""
						layout={EntityLayout.Value}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'label') && Object.hasOwn(prefetched, '$provider') && prefetched.$provider != null && Object.hasOwn(prefetched.$provider, 'label') && Object.hasOwn(prefetched.$provider, 'organizationKind') && Object.hasOwn(prefetched.$provider, 'providerId') && Object.hasOwn(prefetched.$provider, 'domain') && Object.hasOwn(prefetched, 'modelFamily')}
			{@const modelFamily0 = pendingEntity.modelFamily}
			{#if modelFamily0 !== undefined && modelFamily0 !== null}
				<span data-text="muted">
					{String((modelFamily0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiModel}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const modelFamily0 = resolvedEntity.modelFamily}
					{#if modelFamily0 !== undefined && modelFamily0 !== null}
						<span data-text="muted">
							{String((modelFamily0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
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
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									providerModelId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const providerModelId = resolvedEntity.providerModelId}
							{#if providerModelId !== undefined && providerModelId !== null}
								{String((providerModelId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerResourceName: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerResourceName = resolvedEntity.providerResourceName}
					{#if providerResourceName !== undefined && providerResourceName !== null}
						<div>
							<dt>provider resource name</dt>
							<dd>
								{String((providerResourceName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							baseModelId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const baseModelId = resolvedEntity.baseModelId}
					{#if baseModelId !== undefined && baseModelId !== null}
						<div>
							<dt>base model ID</dt>
							<dd>
								{String((baseModelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							label: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							modelFamily: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const modelFamily = resolvedEntity.modelFamily}
					{#if modelFamily !== undefined && modelFamily !== null}
						<div>
							<dt>model family</dt>
							<dd>
								{String((modelFamily) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerOwnedBy = resolvedEntity.providerOwnedBy}
					{#if providerOwnedBy !== undefined && providerOwnedBy !== null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{String((providerOwnedBy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerCreatedAt: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerCreatedAt = resolvedEntity.providerCreatedAt}
					{#if providerCreatedAt !== undefined && providerCreatedAt !== null}
						<div>
							<dt>provider created AT</dt>
							<dd>
								<Timestamp timestamp={Number(providerCreatedAt)} />
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
						ownsSection: true,
					},
					{
						id: 'ai-model-documents',
						label: 'Documents',
						ownsSection: true,
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

			{#snippet MarkerAiModelVersions(_context, Content)}
				{@const aiModelVersionsDocsAiModelVersionsResource = selection.$$versions}
				<ResourceBoundary
					resource={aiModelVersionsDocsAiModelVersionsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionAiModelVersions({ id, label, open, active })}
				{@const aiModelVersionsDocsAiModelVersionsResource = selection.$$versions}
				<ResourceBoundary
					resource={aiModelVersionsDocsAiModelVersionsResource}
				>
					{#snippet children(aiModelVersion)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<AiModelVersionsView
								selection={aiModelVersionsDocsAiModelVersionsResource}
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet MarkerAiModelDocuments(_context, Content)}
				{@const aiModelVersionsDocsAiModelDocumentsResource = selection.$$documents}
				<ResourceBoundary
					resource={aiModelVersionsDocsAiModelDocumentsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionAiModelDocuments({ id, label, open, active })}
				{@const aiModelVersionsDocsAiModelDocumentsResource = selection.$$documents}
				<ResourceBoundary
					resource={aiModelVersionsDocsAiModelDocumentsResource}
				>
					{#snippet children(aiDocument)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<AiDocumentsView
								selection={aiModelVersionsDocsAiModelDocumentsResource}
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
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
						ownsSection: true,
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

			{#snippet MarkerAiModelTimestamps(_context, Content)}
				{@const aiModelObservationsAiModelTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={aiModelObservationsAiModelTimestampsResource}
				>
					{#snippet children(_resolved)}
						{@render Content()}
					{/snippet}

					{#snippet PendingContent()}
						{@render Content()}
					{/snippet}

					{#snippet FailedContent(_error, _retry)}
						{@render Content()}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet SectionAiModelTimestamps({ id, label, open, active })}
				{@const aiModelObservationsAiModelTimestampsResource = selection.$$timestamps}
				<ResourceBoundary
					resource={aiModelObservationsAiModelTimestampsResource}
				>
					{#snippet children(aiModelTimestamp)}
						<section
							id={id}
							aria-labelledby={`${id}:marker`}
							data-scroll-marker-label={label}
							data-column-item="flexible"
							data-column
							data-active={active}
						>
							<AiModel_TimestampsView
								selection={aiModelObservationsAiModelTimestampsResource}
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
						</section>
					{/snippet}

					{#snippet Pending()}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-text="muted" data-resource-state="pending" class="loading inline-placeholder" aria-busy="true" aria-label="Loading…">•••</span>
							</article>
						</section>
					{/snippet}

					{#snippet Failed(_error, _retry)}
						<section id={id} aria-labelledby={`${id}:marker`} data-scroll-marker-label={label} data-column-item="flexible" data-column data-active={active}>
							<article id={`${id}-list`} data-column-item="flexible" data-card data-scroll-container>
								<span data-tag data-resource-state="failed" class="inline-placeholder" aria-label="Failed to load">•••</span>
							</article>
						</section>
					{/snippet}
				</ResourceBoundary>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
