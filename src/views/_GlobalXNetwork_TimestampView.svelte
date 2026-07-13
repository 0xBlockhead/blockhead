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
				{@const timestampMs0 = pendingEntity.timestampMs}
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
						selection={select(EntityType._GlobalXNetwork, selection.entitySelector.$hub, {})}
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
							{@const timestampMs = pendingEntity.timestampMs}
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
							{@const source = pendingEntity.source}
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
							observedUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedUserCount = pendingEntity.observedUserCount}
					{#if observedUserCount !== undefined && observedUserCount !== null}
						<div>
							<dt>observed user count</dt>
							<dd>
								<NumberValue value={Number(observedUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedUserCount = resolvedEntity.observedUserCount}
					{#if observedUserCount !== undefined && observedUserCount !== null}
						<div>
							<dt>observed user count</dt>
							<dd>
								<NumberValue value={Number(observedUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedPostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedPostCount = pendingEntity.observedPostCount}
					{#if observedPostCount !== undefined && observedPostCount !== null}
						<div>
							<dt>observed post count</dt>
							<dd>
								<NumberValue value={Number(observedPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedPostCount = resolvedEntity.observedPostCount}
					{#if observedPostCount !== undefined && observedPostCount !== null}
						<div>
							<dt>observed post count</dt>
							<dd>
								<NumberValue value={Number(observedPostCount)} />
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
							seededUserCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededUserCount = pendingEntity.seededUserCount}
					{#if seededUserCount !== undefined && seededUserCount !== null}
						<div>
							<dt>seeded user count</dt>
							<dd>
								<NumberValue value={Number(seededUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededUserCount = resolvedEntity.seededUserCount}
					{#if seededUserCount !== undefined && seededUserCount !== null}
						<div>
							<dt>seeded user count</dt>
							<dd>
								<NumberValue value={Number(seededUserCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededPostCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededPostCount = pendingEntity.seededPostCount}
					{#if seededPostCount !== undefined && seededPostCount !== null}
						<div>
							<dt>seeded post count</dt>
							<dd>
								<NumberValue value={Number(seededPostCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededPostCount = resolvedEntity.seededPostCount}
					{#if seededPostCount !== undefined && seededPostCount !== null}
						<div>
							<dt>seeded post count</dt>
							<dd>
								<NumberValue value={Number(seededPostCount)} />
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
					{@const reachable = pendingEntity.reachable}
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
					{@const rateLimitRemaining = pendingEntity.rateLimitRemaining}
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
					{@const searchWindowStartMs = pendingEntity.searchWindowStartMs}
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
					{@const searchWindowEndMs = pendingEntity.searchWindowEndMs}
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
