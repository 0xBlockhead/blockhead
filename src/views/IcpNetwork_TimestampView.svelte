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
			selection: EntityProxyResource<typeof schema, EntityType.IcpNetwork_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpNetwork_Timestamp>>
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
	const icpNetworkTimestamp = $derived(selection({}))
	const titleFallback = $derived('ICP network timestamp')
	const viewDomId = $derived('icp-network-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpNetworkView from '$/views/IcpNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpNetwork_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpNetworkTimestamp}>
			{#snippet Pending()}
				{title || 'ICP network timestamp'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<IcpNetworkView
						selection={select(EntityType.IcpNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Title}
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
							registryVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const registryVersion = prefetched.registryVersion}
					{#if registryVersion !== undefined && registryVersion !== null}
						<div>
							<dt>registry version</dt>
							<dd>
								{String((registryVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const registryVersion = resolvedEntity.registryVersion}
					{#if registryVersion !== undefined && registryVersion !== null}
						<div>
							<dt>registry version</dt>
							<dd>
								{String((registryVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetCount = prefetched.subnetCount}
					{#if subnetCount !== undefined && subnetCount !== null}
						<div>
							<dt>subnet count</dt>
							<dd>
								{String((subnetCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetCount = resolvedEntity.subnetCount}
					{#if subnetCount !== undefined && subnetCount !== null}
						<div>
							<dt>subnet count</dt>
							<dd>
								{String((subnetCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const canisterCount = prefetched.canisterCount}
					{#if canisterCount !== undefined && canisterCount !== null}
						<div>
							<dt>canister count</dt>
							<dd>
								{String((canisterCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const canisterCount = resolvedEntity.canisterCount}
					{#if canisterCount !== undefined && canisterCount !== null}
						<div>
							<dt>canister count</dt>
							<dd>
								{String((canisterCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							boundaryNodeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const boundaryNodeCount = prefetched.boundaryNodeCount}
					{#if boundaryNodeCount !== undefined && boundaryNodeCount !== null}
						<div>
							<dt>boundary node count</dt>
							<dd>
								{String((boundaryNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const boundaryNodeCount = resolvedEntity.boundaryNodeCount}
					{#if boundaryNodeCount !== undefined && boundaryNodeCount !== null}
						<div>
							<dt>boundary node count</dt>
							<dd>
								{String((boundaryNodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							rootKeyHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const rootKeyHash = prefetched.rootKeyHash}
					{#if rootKeyHash !== undefined && rootKeyHash !== null}
						<div>
							<dt>root key hash</dt>
							<dd>
								<TruncatedValue value={String((rootKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const rootKeyHash = resolvedEntity.rootKeyHash}
					{#if rootKeyHash !== undefined && rootKeyHash !== null}
						<div>
							<dt>root key hash</dt>
							<dd>
								<TruncatedValue value={String((rootKeyHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
