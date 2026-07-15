<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType._GlobalSwarmAccess_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType._GlobalSwarmAccess_Timestamp>>
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
	const globalSwarmAccessTimestamp = $derived(selection({
		sources: [
			Source.Constants_Internal,
			Source.Swarm_Rest,
		],
	}))
	const titleFallback = $derived('global Swarm access timestamp')
	const viewDomId = $derived('-global-swarm-access-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import GlobalSwarmAccessView from '$/views/_GlobalSwarmAccessView.svelte'
</script>


<EntityView
	entityType={EntityType._GlobalSwarmAccess_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined ? resolve('/swarm/access/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={globalSwarmAccessTimestamp}>
			{#snippet Pending()}
				<GlobalSwarmAccessView
					selection={select(EntityType._GlobalSwarmAccess, selection.entitySelector.$hub)}
					href={(selection.entitySelector.$hub.scope === '_GlobalSwarmAccess' ? resolve('/swarm/access') : undefined)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<GlobalSwarmAccessView
					selection={select(EntityType._GlobalSwarmAccess, selection.entitySelector.$hub)}
					href={(selection.entitySelector.$hub.scope === '_GlobalSwarmAccess' ? resolve('/swarm/access') : undefined)}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={globalSwarmAccessTimestamp}>
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
				<dt>Hub</dt>
				<dd>
					<GlobalSwarmAccessView
						selection={select(EntityType._GlobalSwarmAccess, selection.entitySelector.$hub, {})}
						href={(selection.entitySelector.$hub.scope === '_GlobalSwarmAccess' ? resolve('/swarm/access') : undefined)}
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

			<ResourceBoundary
				resource={
					selection({
						fields: {
							declaredAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const declaredAccessEndpointCount = pendingEntity.declaredAccessEndpointCount}
					{#if declaredAccessEndpointCount !== undefined && declaredAccessEndpointCount !== null}
						<div>
							<dt>Declared access endpoints</dt>
							<dd>
								<NumberValue value={Number(declaredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const declaredAccessEndpointCount = resolvedEntity.declaredAccessEndpointCount}
					{#if declaredAccessEndpointCount !== undefined && declaredAccessEndpointCount !== null}
						<div>
							<dt>Declared access endpoints</dt>
							<dd>
								<NumberValue value={Number(declaredAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reachableAccessEndpointCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const reachableAccessEndpointCount = pendingEntity.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const reachableAccessEndpointCount = resolvedEntity.reachableAccessEndpointCount}
					{#if reachableAccessEndpointCount !== undefined && reachableAccessEndpointCount !== null}
						<div>
							<dt>Reachable access endpoints</dt>
							<dd>
								<NumberValue value={Number(reachableAccessEndpointCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							observedResourceCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const observedResourceCount = pendingEntity.observedResourceCount}
					{#if observedResourceCount !== undefined && observedResourceCount !== null}
						<div>
							<dt>Observed resources</dt>
							<dd>
								<NumberValue value={Number(observedResourceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const observedResourceCount = resolvedEntity.observedResourceCount}
					{#if observedResourceCount !== undefined && observedResourceCount !== null}
						<div>
							<dt>Observed resources</dt>
							<dd>
								<NumberValue value={Number(observedResourceCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							seededExampleCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const seededExampleCount = pendingEntity.seededExampleCount}
					{#if seededExampleCount !== undefined && seededExampleCount !== null}
						<div>
							<dt>Seeded examples</dt>
							<dd>
								<NumberValue value={Number(seededExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const seededExampleCount = resolvedEntity.seededExampleCount}
					{#if seededExampleCount !== undefined && seededExampleCount !== null}
						<div>
							<dt>Seeded examples</dt>
							<dd>
								<NumberValue value={Number(seededExampleCount)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

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
							<dt>Reachable</dt>
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
							<dt>Reachable</dt>
							<dd>
								{reachable ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
