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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadSource_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadSource_Timestamp>>
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
	const blockheadSourceTimestamp = $derived(selection({
		fields: {
			health: true,
			enabled: true,
			latencyMs: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'blockhead source timestamp')
	const viewDomId = $derived('blockhead-source-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import BlockheadSourceView from '$/views/BlockheadSourceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadSource_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadSourceTimestamp}>
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

	{#snippet Value()}
		<ResourceBoundary resource={blockheadSourceTimestamp}>
			{#snippet Pending()}
				{[String((pendingEntity.health) ?? ''), String((pendingEntity.enabled) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || title || 'blockhead source timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.health) ?? ''), String((resolvedEntity.enabled) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadSourceTimestamp}>
			{#snippet Pending()}
				{@const latencyMs0 = pendingEntity.latencyMs}
				{#if latencyMs0 !== undefined && latencyMs0 !== null}
					<span data-text="muted">
						{String((latencyMs0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const latencyMs0 = resolvedEntity.latencyMs}
				{#if latencyMs0 !== undefined && latencyMs0 !== null}
					<span data-text="muted">
						{String((latencyMs0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							enabled: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const enabled = pendingEntity.enabled}
					{#if enabled !== undefined && enabled !== null}
						<div>
							<dt>Enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const enabled = resolvedEntity.enabled}
					{#if enabled !== undefined && enabled !== null}
						<div>
							<dt>Enabled</dt>
							<dd>
								{enabled ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							health: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const health = pendingEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>Health</dt>
							<dd>
								{String((health) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const health = resolvedEntity.health}
					{#if health !== undefined && health !== null}
						<div>
							<dt>Health</dt>
							<dd>
								{String((health) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							latencyMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const latencyMs = pendingEntity.latencyMs}
					{#if latencyMs !== undefined && latencyMs !== null}
						<div>
							<dt>Latency ms</dt>
							<dd>
								{String((latencyMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const latencyMs = resolvedEntity.latencyMs}
					{#if latencyMs !== undefined && latencyMs !== null}
						<div>
							<dt>Latency ms</dt>
							<dd>
								{String((latencyMs) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							statusCode: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const statusCode = pendingEntity.statusCode}
					{#if statusCode !== undefined && statusCode !== null}
						<div>
							<dt>Status code</dt>
							<dd>
								{String((statusCode) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const statusCode = resolvedEntity.statusCode}
					{#if statusCode !== undefined && statusCode !== null}
						<div>
							<dt>Status code</dt>
							<dd>
								{String((statusCode) ?? '')}
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
							error: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const error = pendingEntity.error}
					{#if error !== undefined && error !== null}
						<div>
							<dt>Error</dt>
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
							<dt>Error</dt>
							<dd>
								{String((error) ?? '')}
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
							<dt>Rate limit remaining</dt>
							<dd>
								{String((rateLimitRemaining) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rateLimitRemaining = resolvedEntity.rateLimitRemaining}
					{#if rateLimitRemaining !== undefined && rateLimitRemaining !== null}
						<div>
							<dt>Rate limit remaining</dt>
							<dd>
								{String((rateLimitRemaining) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rateLimitResetMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rateLimitResetMs = pendingEntity.rateLimitResetMs}
					{#if rateLimitResetMs !== undefined && rateLimitResetMs !== null}
						<div>
							<dt>Rate limit reset ms</dt>
							<dd>
								<Timestamp timestamp={Number(rateLimitResetMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rateLimitResetMs = resolvedEntity.rateLimitResetMs}
					{#if rateLimitResetMs !== undefined && rateLimitResetMs !== null}
						<div>
							<dt>Rate limit reset ms</dt>
							<dd>
								<Timestamp timestamp={Number(rateLimitResetMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							resolverCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const resolverCount = pendingEntity.resolverCount}
					{#if resolverCount !== undefined && resolverCount !== null}
						<div>
							<dt>Resolver count</dt>
							<dd>
								{String((resolverCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const resolverCount = resolvedEntity.resolverCount}
					{#if resolverCount !== undefined && resolverCount !== null}
						<div>
							<dt>Resolver count</dt>
							<dd>
								{String((resolverCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Source</dt>
				<dd>
					<BlockheadSourceView
						selection={select(EntityType.BlockheadSource, selection.entitySelector.$source, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
