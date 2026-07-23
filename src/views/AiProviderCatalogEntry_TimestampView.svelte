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
			selection: RegisteredEntityProxyResource<EntityType.AiProviderCatalogEntry_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.AiProviderCatalogEntry_Timestamp>
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
	const aiProviderCatalogEntryTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			availabilityStatus: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			availabilityStatus: true,
		},
	}))
	const titleFallback = 'AI provider catalog entry timestamp'
	const viewDomId = $derived('ai-provider-catalog-entry-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import AiProviderCatalogEntryView from '$/views/AiProviderCatalogEntryView.svelte'
</script>


<EntityView
	entityType={EntityType.AiProviderCatalogEntry_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$entry') && prefetched.$entry != null && Object.hasOwn(prefetched.$entry, 'entryLabel') && Object.hasOwn(prefetched.$entry, 'subjectKind') && Object.hasOwn(prefetched, 'availabilityStatus')}
			{@const aiProviderCatalogEntry0 = pendingEntity.$entry}
			{#if aiProviderCatalogEntry0 != null && selection.entitySelector.$entry != null}
				<AiProviderCatalogEntryView
					selection={select(EntityType.AiProviderCatalogEntry, selection.entitySelector.$entry, { sources: selection.sources })}
					prefetched={aiProviderCatalogEntry0}
					href=""
					layout={EntityLayout.Title}
					open={false}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntryTimestamp}>
				{#snippet children(entity)}
					<AiProviderCatalogEntryView
						selection={select(EntityType.AiProviderCatalogEntry, selection.entitySelector.$entry)}
						href=""
						layout={EntityLayout.Title}
						open={false}
					/>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$entry') && prefetched.$entry != null && Object.hasOwn(prefetched.$entry, 'entryLabel') && Object.hasOwn(prefetched.$entry, 'subjectKind') && Object.hasOwn(prefetched, 'availabilityStatus')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntryTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, '$entry') && prefetched.$entry != null && Object.hasOwn(prefetched.$entry, 'entryLabel') && Object.hasOwn(prefetched.$entry, 'subjectKind') && Object.hasOwn(prefetched, 'availabilityStatus')}
			{@const availabilityStatus0 = pendingEntity.availabilityStatus}
			{#if availabilityStatus0 !== undefined && availabilityStatus0 !== null}
				<span data-text="muted">
					{String((availabilityStatus0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={aiProviderCatalogEntryTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const availabilityStatus0 = resolvedEntity.availabilityStatus}
					{#if availabilityStatus0 !== undefined && availabilityStatus0 !== null}
						<span data-text="muted">
							{String((availabilityStatus0) ?? '')}
						</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>entry</dt>
				<dd>
					<AiProviderCatalogEntryView
						selection={select(EntityType.AiProviderCatalogEntry, selection.entitySelector.$entry)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
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
							availabilityStatus: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const availabilityStatus = resolvedEntity.availabilityStatus}
					{#if availabilityStatus !== undefined && availabilityStatus !== null}
						<div>
							<dt>availability status</dt>
							<dd>
								{String((availabilityStatus) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
