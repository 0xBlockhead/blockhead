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
			selection: EntityProxyResource<typeof schema, EntityType.AiModelProvider>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiModelProvider>>
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
	const aiModelProvider = $derived(selection({
		fields: {
			label: true,
			organizationKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerId) ?? ''), String((pendingEntity.domain) ?? '')].filter(Boolean).join(' ') || 'AI model provider')
	const viewDomId = $derived('ai-model-provider-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import CollapsibleTabs from '$/components/CollapsibleTabs.svelte'
	import HeadingComponent from '$/components/Heading.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AiProviderCatalogEntriesView from '$/views/AiProviderCatalogEntriesView.svelte'
	import AiModelsView from '$/views/AiModelsView.svelte'
	import AiProviderApiOperationsView from '$/views/AiProviderApiOperationsView.svelte'
</script>


<EntityView
	entityType={EntityType.AiModelProvider}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiModelProvider}>
			{#snippet Pending()}
				{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerId) ?? ''), String((pendingEntity.domain) ?? '')].filter(Boolean).join(' ') || 'AI model provider'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiModelProvider}>
			{#snippet Pending()}
				{[String((pendingEntity.organizationKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerId) ?? ''), String((pendingEntity.domain) ?? '')].filter(Boolean).join(' ') || 'AI model provider'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.organizationKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							providerId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const providerId = pendingEntity.providerId}
					{#if providerId !== undefined && providerId !== null}
						<div>
							<dt>provider ID</dt>
							<dd>
								{String((providerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const providerId = resolvedEntity.providerId}
					{#if providerId !== undefined && providerId !== null}
						<div>
							<dt>provider ID</dt>
							<dd>
								{String((providerId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							domain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const domain = pendingEntity.domain}
					{#if domain !== undefined && domain !== null}
						<div>
							<dt>domain</dt>
							<dd>
								{String((domain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const domain = resolvedEntity.domain}
					{#if domain !== undefined && domain !== null}
						<div>
							<dt>domain</dt>
							<dd>
								{String((domain) ?? '')}
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
							organizationKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const organizationKind = pendingEntity.organizationKind}
					{#if organizationKind !== undefined && organizationKind !== null}
						<div>
							<dt>organization kind</dt>
							<dd>
								{String((organizationKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const organizationKind = resolvedEntity.organizationKind}
					{#if organizationKind !== undefined && organizationKind !== null}
						<div>
							<dt>organization kind</dt>
							<dd>
								{String((organizationKind) ?? '')}
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
							homepageUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const homepageUrl = pendingEntity.homepageUrl}
					{#if homepageUrl !== undefined && homepageUrl !== null}
						<div>
							<dt>homepage URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(homepageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homepageUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const homepageUrl = resolvedEntity.homepageUrl}
					{#if homepageUrl !== undefined && homepageUrl !== null}
						<div>
							<dt>homepage URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(homepageUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(homepageUrl)} />
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
							docsUrl: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const docsUrl = pendingEntity.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const docsUrl = resolvedEntity.docsUrl}
					{#if docsUrl !== undefined && docsUrl !== null}
						<div>
							<dt>docs URL</dt>
							<dd>
								<svelte:element
									this={'a'}
									href={String(docsUrl)}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={String(docsUrl)} />
								</svelte:element>
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
				id={viewDomId + '-carousel-ai-provider-catalog'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-provider-catalog-entries',
							label: 'Catalog entries',
						},
						{
							id: 'ai-provider-models',
							label: 'Models',
						},
					]
				}
				data-card
				class='network-view-collapsible-catalog'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Catalog and models</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiProviderCatalogEntries({ id, label, open })}
					<AiProviderCatalogEntriesView
						selection={
							selection.$$catalogEntries({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI provider catalog entries.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiProviderModels({ id, label, open })}
					<AiModelsView
						selection={
							selection.$$models({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI models.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>

			<CollapsibleTabs
				id={viewDomId + '-carousel-ai-provider-api'}
				sectionIdPrefix={viewDomId}
				sections={
					[
						{
							id: 'ai-provider-api-operations',
							label: 'API operations',
						},
					]
				}
				data-card
				class='network-view-collapsible-api'
				scrollContainerProps={{
					'data-row': 'start align-start',
				}}
			>
				{#snippet Summary({})}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>API operations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiProviderApiOperations({ id, label, open })}
					<AiProviderApiOperationsView
						selection={
							selection.$$apiOperations({
								count: true,
							})
						}
						CollapsibleProps={{ canToggle: false }}
						emptyText='No AI provider API operations.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

			</CollapsibleTabs>
		{/if}
	{/snippet}
</EntityView>
