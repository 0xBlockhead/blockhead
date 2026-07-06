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
			selection: EntityProxyResource<typeof schema, EntityType._GlobalXNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType._GlobalXNetwork_Timestamp>>
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
	const globalXNetworkTimestamp = $derived(selection({
		sources: [
			Source.X_Rest,
			Source.X_FxEmbed_Rest,
		],
	}))
	const titleFallback = $derived('global X network timestamp')
	const viewDomId = $derived('-global-xnetwork-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalXNetworkView from '$/views/_GlobalXNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalXNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalXNetworkTimestamp}>
			{#snippet Pending()}
				<GlobalXNetworkView
					selection={select(EntityType._GlobalXNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalXNetworkView
					selection={select(EntityType._GlobalXNetwork, selection.entitySelector.$hub)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalXNetworkTimestamp}>
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
					<GlobalXNetworkView
						selection={select(EntityType._GlobalXNetwork, selection.entitySelector.$hub)}
						layout={EntityLayout.Value}
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
							sourceWindowUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceWindowUserCount = prefetched.sourceWindowUserCount}
					{#if sourceWindowUserCount !== undefined && sourceWindowUserCount !== null}
						<div>
							<dt>source window user count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceWindowUserCount = resolvedEntity.sourceWindowUserCount}
					{#if sourceWindowUserCount !== undefined && sourceWindowUserCount !== null}
						<div>
							<dt>source window user count</dt>
							<dd>
								<NumberValue value={Number(sourceWindowUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							localCatalogUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const localCatalogUserCount = prefetched.localCatalogUserCount}
					{#if localCatalogUserCount !== undefined && localCatalogUserCount !== null}
						<div>
							<dt>local catalog user count</dt>
							<dd>
								<NumberValue value={Number(localCatalogUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const localCatalogUserCount = resolvedEntity.localCatalogUserCount}
					{#if localCatalogUserCount !== undefined && localCatalogUserCount !== null}
						<div>
							<dt>local catalog user count</dt>
							<dd>
								<NumberValue value={Number(localCatalogUserCount)} />
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
							rateLimitRemaining: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rateLimitRemaining = prefetched.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>rate limit remaining</dt>
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
							<dt>rate limit remaining</dt>
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
							searchWindowStartMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const searchWindowStartMs = prefetched.searchWindowStartMs}
					{#if searchWindowStartMs !== undefined && searchWindowStartMs !== null}
						<div>
							<dt>search window start ms</dt>
							<dd>
								<Timestamp timestamp={Number(searchWindowStartMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const searchWindowStartMs = resolvedEntity.searchWindowStartMs}
					{#if searchWindowStartMs !== undefined && searchWindowStartMs !== null}
						<div>
							<dt>search window start ms</dt>
							<dd>
								<Timestamp timestamp={Number(searchWindowStartMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							searchWindowEndMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const searchWindowEndMs = prefetched.searchWindowEndMs}
					{#if searchWindowEndMs !== undefined && searchWindowEndMs !== null}
						<div>
							<dt>search window end ms</dt>
							<dd>
								<Timestamp timestamp={Number(searchWindowEndMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const searchWindowEndMs = resolvedEntity.searchWindowEndMs}
					{#if searchWindowEndMs !== undefined && searchWindowEndMs !== null}
						<div>
							<dt>search window end ms</dt>
							<dd>
								<Timestamp timestamp={Number(searchWindowEndMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
