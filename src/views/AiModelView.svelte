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
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.AiModel>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiModel>>
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
	const aiModel = $derived(selection({
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
		fields: {
			label: true,
			modelFamily: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model')
	const viewDomId = $derived('ai-model-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		<ResourceBoundary resource={aiModel}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerModelId) ?? '')].filter(Boolean).join(' ') || 'AI model'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiModel}>
			{#snippet Pending()}
				<AiModelProviderView
					selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<AiModelProviderView
					selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider)}
					layout={EntityLayout.Value}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiModel}>
			{#snippet Pending()}
				{@const modelFamily0 = pendingEntity.modelFamily}
				{#if modelFamily0 !== undefined && modelFamily0 !== null}
					<span data-text="muted">
						{String((modelFamily0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>provider</dt>
				<dd>
					<AiModelProviderView
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider, {})}
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
								fields: {
									providerModelId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const providerModelId = pendingEntity.providerModelId}
							{#if providerModelId !== undefined && providerModelId !== null}
								{String((providerModelId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							providerResourceName: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerResourceName = pendingEntity.providerResourceName}
					{#if providerResourceName !== undefined && providerResourceName !== null}
						<div>
							<dt>provider resource name</dt>
							<dd>
								{String((providerResourceName) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							baseModelId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const baseModelId = pendingEntity.baseModelId}
					{#if baseModelId !== undefined && baseModelId !== null}
						<div>
							<dt>base model ID</dt>
							<dd>
								{String((baseModelId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
							modelFamily: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const modelFamily = pendingEntity.modelFamily}
					{#if modelFamily !== undefined && modelFamily !== null}
						<div>
							<dt>model family</dt>
							<dd>
								{String((modelFamily) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerOwnedBy: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerOwnedBy = pendingEntity.providerOwnedBy}
					{#if providerOwnedBy !== undefined && providerOwnedBy !== null}
						<div>
							<dt>provider owned by</dt>
							<dd>
								{String((providerOwnedBy) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							providerCreatedAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerCreatedAt = pendingEntity.providerCreatedAt}
					{#if providerCreatedAt !== undefined && providerCreatedAt !== null}
						<div>
							<dt>provider created AT</dt>
							<dd>
								<Timestamp timestamp={Number(providerCreatedAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Versions and documents</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiModelVersions({ id, label, open })}
					<AiModelVersionsView
						selection={selection.$$versions}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI model versions.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiModelDocuments({ id, label, open })}
					<AiDocumentsView
						selection={selection.$$documents}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No linked documents.'
						open={open}
						title={label}
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
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Observations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiModelTimestamps({ id, label, open })}
					<AiModel_TimestampsView
						selection={selection.$$timestamps}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI model observations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
