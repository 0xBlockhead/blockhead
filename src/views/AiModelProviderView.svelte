<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.AiModelProvider>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiModelProvider>>
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
		sources: selection.sources,
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
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModelProvider}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.organizationKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiModelProvider}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.organizationKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.label) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							providerId: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							domain: true,
						},
					})
				}
			>
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
							organizationKind: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							homepageUrl: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							docsUrl: true,
						},
					})
				}
			>
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>Catalog and models</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiProviderCatalogEntries({ id, label, open })}
					<AiProviderCatalogEntriesView
						selection={selection.$$catalogEntries}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
						emptyText='No AI provider catalog entries.'
						open={open}
						title={label}
						id={`${id}-list`}
					/>
				{/snippet}

				{#snippet SectionAiProviderModels({ id, label, open })}
					<AiModelsView
						selection={selection.$$models}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
			>
				{#snippet Summary()}
					<header data-row-item="flexible" data-row="wrap gap-4">
						<HeadingComponent>API operations</HeadingComponent>
					</header>
				{/snippet}

				{#snippet SectionAiProviderApiOperations({ id, label, open })}
					<AiProviderApiOperationsView
						selection={selection.$$apiOperations}
						CollapsibleProps={{ canToggle: false }}
						collapsible={false}
						data-column-item="flexible"
						data-card
						data-scroll-container
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
