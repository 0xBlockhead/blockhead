<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { Source } from '$/sources/Source.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadEnsNameSearch>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadEnsNameSearch>>
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
	const blockheadEnsNameSearch = $derived(selection({
		sources: [
			Source.Local_Internal,
			Source.TheGraph_Graphql,
		],
		fields: {
			createdAt: true,
			resultLimit: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.query ?? prefetched.query) ?? '')].filter(Boolean).join(' ') || 'blockhead ENS name search')
	const viewDomId = $derived('blockhead-ens-name-search-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import EnsNamesView from '$/views/EnsNamesView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadEnsNameSearch}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadEnsNameSearch}>
			{#snippet Pending()}
				{[String((selection.entitySelector.query ?? prefetched.query) ?? '')].filter(Boolean).join(' ') || title || 'blockhead ENS name search'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.query) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadEnsNameSearch}>
			{#snippet Pending()}
				{[String((prefetched.resultLimit) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.query ?? prefetched.query) ?? '')].filter(Boolean).join(' ') || title || 'blockhead ENS name search'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.resultLimit) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.query) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Query</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									query: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const query = selection.entitySelector.query ?? prefetched.query}
							{#if query !== undefined && query !== null}
								{String((query) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const query = resolvedEntity.query}
							{#if query !== undefined && query !== null}
								{String((query) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							createdAt: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAt = prefetched.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAt = resolvedEntity.createdAt}
					{#if createdAt !== undefined && createdAt !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAt)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resultLimit: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resultLimit = prefetched.resultLimit}
					{#if resultLimit !== undefined && resultLimit !== null}
						<div>
							<dt>result limit</dt>
							<dd>
								{String((resultLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resultLimit = resolvedEntity.resultLimit}
					{#if resultLimit !== undefined && resultLimit !== null}
						<div>
							<dt>result limit</dt>
							<dd>
								{String((resultLimit) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<EnsNamesView
				selection={selection[EntityProxyField]<EntityType.EnsName>('$$matchingNames')}
				title='matching names'
				emptyText='No matching ENS names.'
				id='EnsNamesView-$$matchingNames'
			/>
		{/if}
	{/snippet}
</EntityView>
