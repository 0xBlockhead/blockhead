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
	import { ZeroExHex } from '$/schema/ZeroExHex.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalAiModelCatalog_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalAiModelCatalog_Timestamp>>
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
	const globalAiModelCatalogTimestamp = $derived(selection({
		fields: {
			status: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || 'global AI model catalog timestamp')
	const viewDomId = $derived('-global-ai-model-catalog-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import GlobalAiModelCatalogView from '$/views/_GlobalAiModelCatalogView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalAiModelCatalog_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalAiModelCatalogTimestamp}>
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

	{#snippet Value()}
		<ResourceBoundary resource={globalAiModelCatalogTimestamp}>
			{#snippet Pending()}
				{[String((prefetched.status) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.timestampMs ?? prefetched.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'global AI model catalog timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.status) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={globalAiModelCatalogTimestamp}>
			{#snippet Pending()}
				{@const source0 = selection.entitySelector.source ?? prefetched.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>catalog</dt>
				<dd>
					<GlobalAiModelCatalogView
						selection={select(EntityType._GlobalAiModelCatalog, selection.entitySelector.$catalog)}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const status = prefetched.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const status = resolvedEntity.status}
					{#if status !== undefined && status !== null}
						<div>
							<dt>status</dt>
							<dd>
								{String((status) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = prefetched.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const error = resolvedEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>error</dt>
							<dd>
								{String((error) ?? '')}
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
							sourceReportedModelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceReportedModelCount = prefetched.sourceReportedModelCount}
					{#if sourceReportedModelCount !== undefined && sourceReportedModelCount !== null}
						<div>
							<dt>sourceReportedModelCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedModelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceReportedModelCount = resolvedEntity.sourceReportedModelCount}
					{#if sourceReportedModelCount !== undefined && sourceReportedModelCount !== null}
						<div>
							<dt>sourceReportedModelCount</dt>
							<dd>
								<NumberValue value={Number(sourceReportedModelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogModelCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogModelCount = prefetched.localCatalogModelCount}
					{#if localCatalogModelCount !== undefined && localCatalogModelCount !== null}
						<div>
							<dt>localCatalogModelCount</dt>
							<dd>
								<NumberValue value={Number(localCatalogModelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogModelCount = resolvedEntity.localCatalogModelCount}
					{#if localCatalogModelCount !== undefined && localCatalogModelCount !== null}
						<div>
							<dt>localCatalogModelCount</dt>
							<dd>
								<NumberValue value={Number(localCatalogModelCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							searchResultCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const searchResultCount = prefetched.searchResultCount}
					{#if searchResultCount !== undefined && searchResultCount !== null}
						<div>
							<dt>searchResultCount</dt>
							<dd>
								<NumberValue value={Number(searchResultCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const searchResultCount = resolvedEntity.searchResultCount}
					{#if searchResultCount !== undefined && searchResultCount !== null}
						<div>
							<dt>searchResultCount</dt>
							<dd>
								<NumberValue value={Number(searchResultCount)} />
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
							configuredEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const configuredEndpointCount = prefetched.configuredEndpointCount}
					{#if configuredEndpointCount !== undefined && configuredEndpointCount !== null}
						<div>
							<dt>configuredEndpointCount</dt>
							<dd>
								<NumberValue value={Number(configuredEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const configuredEndpointCount = resolvedEntity.configuredEndpointCount}
					{#if configuredEndpointCount !== undefined && configuredEndpointCount !== null}
						<div>
							<dt>configuredEndpointCount</dt>
							<dd>
								<NumberValue value={Number(configuredEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachableEndpointCount = prefetched.reachableEndpointCount}
					{#if reachableEndpointCount !== undefined && reachableEndpointCount !== null}
						<div>
							<dt>reachableEndpointCount</dt>
							<dd>
								<NumberValue value={Number(reachableEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachableEndpointCount = resolvedEntity.reachableEndpointCount}
					{#if reachableEndpointCount !== undefined && reachableEndpointCount !== null}
						<div>
							<dt>reachableEndpointCount</dt>
							<dd>
								<NumberValue value={Number(reachableEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rateLimitRemaining = prefetched.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>rateLimitRemaining</dt>
							<dd>
								<NumberValue value={Number(rateLimitRemaining)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rateLimitRemaining = resolvedEntity.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>rateLimitRemaining</dt>
							<dd>
								<NumberValue value={Number(rateLimitRemaining)} />
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
							queryHashAlgorithm: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const queryHashAlgorithm = prefetched.queryHashAlgorithm}
					{#if queryHashAlgorithm !== undefined && queryHashAlgorithm !== null}
						<div>
							<dt>query hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((queryHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryHashAlgorithm = resolvedEntity.queryHashAlgorithm}
					{#if queryHashAlgorithm !== undefined && queryHashAlgorithm !== null}
						<div>
							<dt>query hash algorithm</dt>
							<dd>
								<TruncatedValue value={String((queryHashAlgorithm) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							queryHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const queryHash = prefetched.queryHash}
					{#if queryHash !== undefined && queryHash !== null}
						<div>
							<dt>query hash</dt>
							<dd>
								<TruncatedValue value={String((queryHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const queryHash = resolvedEntity.queryHash}
					{#if queryHash !== undefined && queryHash !== null}
						<div>
							<dt>query hash</dt>
							<dd>
								<TruncatedValue value={String((queryHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							lastCursor: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const lastCursor = prefetched.lastCursor}
					{#if lastCursor !== undefined && lastCursor !== null}
						<div>
							<dt>last cursor</dt>
							<dd>
								{String((lastCursor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const lastCursor = resolvedEntity.lastCursor}
					{#if lastCursor !== undefined && lastCursor !== null}
						<div>
							<dt>last cursor</dt>
							<dd>
								{String((lastCursor) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
