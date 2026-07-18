<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.AiProviderCatalogEntry>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.AiProviderCatalogEntry>>
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
	const aiProviderCatalogEntry = $derived(selection({
		sources: selection.sources,
		fields: {
			entryLabel: true,
			subjectKind: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.providerEntryId) ?? '')].filter(Boolean).join(' ') || 'AI provider catalog entry')
	const viewDomId = $derived('ai-provider-catalog-entry-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import AiProviderCatalogEntry_TimestampsView from '$/views/AiProviderCatalogEntry_TimestampsView.svelte'
	import AiModelProviderView from '$/views/AiModelProviderView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderCatalogEntry}
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
			{[String((pendingEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntry}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.catalogKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntry}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.catalogKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{@const subjectKind0 = pendingEntity.subjectKind}
			{#if subjectKind0 !== undefined && subjectKind0 !== null}
				<span data-text="muted">
					{String((subjectKind0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntry}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subjectKind0 = resolvedEntity.subjectKind}
					{#if subjectKind0 !== undefined && subjectKind0 !== null}
						<span data-text="muted">
							{String((subjectKind0) ?? '')}
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
						selection={select(EntityType.AiModelProvider, selection.entitySelector.$provider, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>catalog kind</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									catalogKind: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const catalogKind = resolvedEntity.catalogKind}
							{#if catalogKind !== undefined && catalogKind !== null}
								{String((catalogKind) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>provider entry ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									providerEntryId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const providerEntryId = resolvedEntity.providerEntryId}
							{#if providerEntryId !== undefined && providerEntryId !== null}
								{String((providerEntryId) ?? '')}
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
							entryLabel: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const entryLabel = resolvedEntity.entryLabel}
					{#if entryLabel !== undefined && entryLabel !== null}
						<div>
							<dt>entry label</dt>
							<dd>
								{String((entryLabel) ?? '')}
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
							subjectKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subjectKind = resolvedEntity.subjectKind}
					{#if subjectKind !== undefined && subjectKind !== null}
						<div>
							<dt>subject kind</dt>
							<dd>
								{String((subjectKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AiProviderCatalogEntry_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No AI provider catalog entry observations.'
				id='AiProviderCatalogEntry_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
