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
	}: EntitySelectionViewProps<EntityType.AiModelProvider> = $props()

	const aiModelProvider = $derived(selection({
		fields: {
			label: true,
			organizationKind: true,
			providerId: true,
			domain: true,
		},
	}))
	const titleFallback = $derived((prefetched.label ?? '') || [(prefetched.providerId ?? ''), (prefetched.domain ?? '')].filter(Boolean).join(' ') || 'AI model provider')
	const viewDomId = $derived('ai-model-provider-' + encodeURIComponent(stringify(selection.entitySelector)))


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
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={aiModelProvider}>
			{#snippet children(entity)}
				{(entity.label ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiModelProvider}>
			{#snippet children(entity)}
				{(entity.organizationKind ?? '') || (entity.label ?? '') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={aiModelProvider}
			>
				{#snippet children(entity)}
					{@const providerId = entity.providerId}
					{#if providerId != null}
						<div>
							<dt>provider ID</dt>
							<dd>
								{providerId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelProvider}
			>
				{#snippet children(entity)}
					{@const domain = entity.domain}
					{#if domain != null}
						<div>
							<dt>domain</dt>
							<dd>
								{domain}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={aiModelProvider}
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
				resource={aiModelProvider}
			>
				{#snippet children(entity)}
					{@const organizationKind = entity.organizationKind}
					{#if organizationKind != null}
						<div>
							<dt>organization kind</dt>
							<dd>
								{organizationKind}
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
				{#snippet children(entity)}
					{@const homepageUrl = entity.homepageUrl}
					{#if homepageUrl != null}
						<div>
							<dt>homepage URL</dt>
							<dd>
								<a
									href={homepageUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={homepageUrl} />
								</a>
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
				{#snippet children(entity)}
					{@const docsUrl = entity.docsUrl}
					{#if docsUrl != null}
						<div>
							<dt>docs URL</dt>
							<dd>
								<a
									href={docsUrl}
									target="_blank"
									rel="noreferrer noopener"
								>
									<TruncatedValue value={docsUrl} />
								</a>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
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
					collapsible={false}
					title={label}
					emptyText='No AI provider catalog entries.'
					id={`${id}-list`}
				/>
			{/snippet}

			{#snippet SectionAiProviderModels({ id, label, open })}
				<AiModelsView
					selection={selection.$$models}
					collapsible={false}
					title={label}
					emptyText='No AI models.'
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
					collapsible={false}
					title={label}
					emptyText='No AI provider API operations.'
					id={`${id}-list`}
				/>
			{/snippet}

		</CollapsibleTabs>
	{/snippet}
</EntityView>
