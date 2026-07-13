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
			selection: EntityProxyResource<typeof schema, EntityType.AiProviderCatalogEntry>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AiProviderCatalogEntry>>
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
		sources: [
			Source.Anthropic_Rest,
			Source.OpenAI_Rest,
		],
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
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet Pending()}
				{[String((pendingEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerEntryId) ?? '')].filter(Boolean).join(' ') || 'AI provider catalog entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet Pending()}
				{[String((pendingEntity.catalogKind) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.providerEntryId) ?? '')].filter(Boolean).join(' ') || 'AI provider catalog entry'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.catalogKind) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.entryLabel) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={aiProviderCatalogEntry}>
			{#snippet Pending()}
				{@const subjectKind0 = pendingEntity.subjectKind}
				{#if subjectKind0 !== undefined && subjectKind0 !== null}
					<span data-text="muted">
						{String((subjectKind0) ?? '')}
					</span>
				{/if}
			{/snippet}

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
								fields: {
									catalogKind: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const catalogKind = pendingEntity.catalogKind}
							{#if catalogKind !== undefined && catalogKind !== null}
								{String((catalogKind) ?? '')}
							{/if}
						{/snippet}

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
								fields: {
									providerEntryId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const providerEntryId = pendingEntity.providerEntryId}
							{#if providerEntryId !== undefined && providerEntryId !== null}
								{String((providerEntryId) ?? '')}
							{/if}
						{/snippet}

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
						fields: {
							entryLabel: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const entryLabel = pendingEntity.entryLabel}
					{#if entryLabel !== undefined && entryLabel !== null}
						<div>
							<dt>entry label</dt>
							<dd>
								{String((entryLabel) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							subjectKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subjectKind = pendingEntity.subjectKind}
					{#if subjectKind !== undefined && subjectKind !== null}
						<div>
							<dt>subject kind</dt>
							<dd>
								{String((subjectKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
