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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalLensNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalLensNetwork_Timestamp>>
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
	const globalLensNetworkTimestamp = $derived(selection({
		sources: [
			Source.Lens_Graphql,
		],
	}))
	const titleFallback = $derived('global lens network timestamp')
	const viewDomId = $derived('-global-lens-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalLensNetworkView from '$/views/_GlobalLensNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalLensNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalLensNetworkTimestamp}>
			{#snippet Pending()}
				<GlobalLensNetworkView
					selection={select(EntityType._GlobalLensNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalLensNetworkView
					selection={select(EntityType._GlobalLensNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalLensNetworkTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>hub</dt>
				<dd>
					<GlobalLensNetworkView
						selection={select(EntityType._GlobalLensNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = selection.entitySelector.timestampMs ?? prefetched.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = selection.entitySelector.source ?? prefetched.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowAccountCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowAccountCount = prefetched.sourceWindowAccountCount}
					{#if sourceWindowAccountCount !== undefined && sourceWindowAccountCount !== null}
						<div>
							<dt>source window account count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowAccountCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowAccountCount = resolvedEntity.sourceWindowAccountCount}
					{#if sourceWindowAccountCount !== undefined && sourceWindowAccountCount !== null}
						<div>
							<dt>source window account count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowAccountCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowFeedCount = prefetched.sourceWindowFeedCount}
					{#if sourceWindowFeedCount !== undefined && sourceWindowFeedCount !== null}
						<div>
							<dt>source window feed count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowFeedCount = resolvedEntity.sourceWindowFeedCount}
					{#if sourceWindowFeedCount !== undefined && sourceWindowFeedCount !== null}
						<div>
							<dt>source window feed count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowFeedCount)} />
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
							sourceWindowPostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowPostCount = prefetched.sourceWindowPostCount}
					{#if sourceWindowPostCount !== undefined && sourceWindowPostCount !== null}
						<div>
							<dt>source window post count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowPostCount = resolvedEntity.sourceWindowPostCount}
					{#if sourceWindowPostCount !== undefined && sourceWindowPostCount !== null}
						<div>
							<dt>source window post count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sourceWindowUsernameNamespaceCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowUsernameNamespaceCount = prefetched.sourceWindowUsernameNamespaceCount}
					{#if sourceWindowUsernameNamespaceCount !== undefined && sourceWindowUsernameNamespaceCount !== null}
						<div>
							<dt>source window username namespace count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUsernameNamespaceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowUsernameNamespaceCount = resolvedEntity.sourceWindowUsernameNamespaceCount}
					{#if sourceWindowUsernameNamespaceCount !== undefined && sourceWindowUsernameNamespaceCount !== null}
						<div>
							<dt>source window username namespace count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUsernameNamespaceCount)} />
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
							localCatalogAccountCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogAccountCount = prefetched.localCatalogAccountCount}
					{#if localCatalogAccountCount !== undefined && localCatalogAccountCount !== null}
						<div>
							<dt>local catalog account count</dt>
							<dd>
								<NumberValue value={Number(localCatalogAccountCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogAccountCount = resolvedEntity.localCatalogAccountCount}
					{#if localCatalogAccountCount !== undefined && localCatalogAccountCount !== null}
						<div>
							<dt>local catalog account count</dt>
							<dd>
								<NumberValue value={Number(localCatalogAccountCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogFeedCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogFeedCount = prefetched.localCatalogFeedCount}
					{#if localCatalogFeedCount !== undefined && localCatalogFeedCount !== null}
						<div>
							<dt>local catalog feed count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogFeedCount = resolvedEntity.localCatalogFeedCount}
					{#if localCatalogFeedCount !== undefined && localCatalogFeedCount !== null}
						<div>
							<dt>local catalog feed count</dt>
							<dd>
								<NumberValue value={Number(localCatalogFeedCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogPostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogPostCount = prefetched.localCatalogPostCount}
					{#if localCatalogPostCount !== undefined && localCatalogPostCount !== null}
						<div>
							<dt>local catalog post count</dt>
							<dd>
								<NumberValue value={Number(localCatalogPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogPostCount = resolvedEntity.localCatalogPostCount}
					{#if localCatalogPostCount !== undefined && localCatalogPostCount !== null}
						<div>
							<dt>local catalog post count</dt>
							<dd>
								<NumberValue value={Number(localCatalogPostCount)} />
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
							reachable: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachable = prefetched.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachable = resolvedEntity.reachable}
					{#if reachable !== undefined && reachable !== null}
						<div>
							<dt>reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cursor: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const cursor = prefetched.cursor}
					{#if cursor !== undefined && cursor !== null}
						<div>
							<dt>cursor</dt>
							<dd>
								<TruncatedValue value={String((cursor) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const cursor = resolvedEntity.cursor}
					{#if cursor !== undefined && cursor !== null}
						<div>
							<dt>cursor</dt>
							<dd>
								<TruncatedValue value={String((cursor) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
