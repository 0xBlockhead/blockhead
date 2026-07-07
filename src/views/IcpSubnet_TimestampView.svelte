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
			selection: EntityProxyResource<typeof schema, EntityType.IcpSubnet_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.IcpSubnet_Timestamp>>
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
	const icpSubnetTimestamp = $derived(selection({}))
	const titleFallback = $derived('ICP subnet timestamp')
	const viewDomId = $derived('icp-subnet-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpSubnet_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={icpSubnetTimestamp}>
			{#snippet Pending()}
				{title || 'ICP subnet timestamp'}
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
				<dt>subnet</dt>
				<dd>
					<IcpSubnetView
						selection={select(EntityType.IcpSubnet, selection.entitySelector.$subnet, {})}
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
							subnetKind: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetKind = prefetched.subnetKind}
					{#if subnetKind !== undefined && subnetKind !== null}
						<div>
							<dt>subnet kind</dt>
							<dd>
								{String((subnetKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetKind = resolvedEntity.subnetKind}
					{#if subnetKind !== undefined && subnetKind !== null}
						<div>
							<dt>subnet kind</dt>
							<dd>
								{String((subnetKind) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							publicKey: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const publicKey = prefetched.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const publicKey = resolvedEntity.publicKey}
					{#if publicKey !== undefined && publicKey !== null}
						<div>
							<dt>public key</dt>
							<dd>
								{String((publicKey) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeCount = prefetched.nodeCount}
					{#if nodeCount !== undefined && nodeCount !== null}
						<div>
							<dt>node count</dt>
							<dd>
								{String((nodeCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeCount = resolvedEntity.nodeCount}
					{#if nodeCount !== undefined && nodeCount !== null}
						<div>
							<dt>node count</dt>
							<dd>
								{String((nodeCount) ?? '')}
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
							replicaVersion: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const replicaVersion = prefetched.replicaVersion}
					{#if replicaVersion !== undefined && replicaVersion !== null}
						<div>
							<dt>replica version</dt>
							<dd>
								{String((replicaVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const replicaVersion = resolvedEntity.replicaVersion}
					{#if replicaVersion !== undefined && replicaVersion !== null}
						<div>
							<dt>replica version</dt>
							<dd>
								{String((replicaVersion) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stateRootHash: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stateRootHash = prefetched.stateRootHash}
					{#if stateRootHash !== undefined && stateRootHash !== null}
						<div>
							<dt>state root hash</dt>
							<dd>
								<TruncatedValue value={String((stateRootHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stateRootHash = resolvedEntity.stateRootHash}
					{#if stateRootHash !== undefined && stateRootHash !== null}
						<div>
							<dt>state root hash</dt>
							<dd>
								<TruncatedValue value={String((stateRootHash) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							certifiedHeight: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const certifiedHeight = prefetched.certifiedHeight}
					{#if certifiedHeight !== undefined && certifiedHeight !== null}
						<div>
							<dt>certified height</dt>
							<dd>
								{String((certifiedHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const certifiedHeight = resolvedEntity.certifiedHeight}
					{#if certifiedHeight !== undefined && certifiedHeight !== null}
						<div>
							<dt>certified height</dt>
							<dd>
								{String((certifiedHeight) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
