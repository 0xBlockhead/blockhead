<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpSubnet_Timestamp>, 'prefetched'> = $props()

	const subnet = $derived(selection.entitySelector.$subnet)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpSubnet_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP subnet timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/subnet/[subnetId=stringSegment]/(icpSubnet)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in subnet.$network.$network ?
							caip2StringFromValue(subnet.$network.$network.caip2)
						:
							subnet.$network.$network.slug
					),
					subnetId: subnet.subnetId,
					timestampMs: String(selection.entitySelector.timestampMs),
					source: selection.entitySelector.source,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>subnet</dt>
				<dd>
					<IcpSubnetView
						selection={select(EntityType.IcpSubnet, selection.entitySelector.$subnet)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Timestamp</dt>
				<dd>
					<Timestamp timestamp={selection.entitySelector.timestampMs} />
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
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
				{#snippet children(entity)}
					{@const subnetKind = entity.subnetKind}
					{#if subnetKind != null}
						<div>
							<dt>subnet kind</dt>
							<dd>
								{subnetKind}
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
				{#snippet children(entity)}
					{@const publicKey = entity.publicKey}
					{#if publicKey != null}
						<div>
							<dt>public key</dt>
							<dd>
								{publicKey}
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
				{#snippet children(entity)}
					{@const nodeCount = entity.nodeCount}
					{#if nodeCount != null}
						<div>
							<dt>node count</dt>
							<dd>
								{nodeCount}
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
				{#snippet children(entity)}
					{@const canisterCount = entity.canisterCount}
					{#if canisterCount != null}
						<div>
							<dt>canister count</dt>
							<dd>
								{canisterCount}
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
				{#snippet children(entity)}
					{@const replicaVersion = entity.replicaVersion}
					{#if replicaVersion != null}
						<div>
							<dt>replica version</dt>
							<dd>
								{replicaVersion}
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
				{#snippet children(entity)}
					{@const stateRootHash = entity.stateRootHash}
					{#if stateRootHash != null}
						<div>
							<dt>state root hash</dt>
							<dd>
								<TruncatedValue value={stateRootHash} />
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
				{#snippet children(entity)}
					{@const certifiedHeight = entity.certifiedHeight}
					{#if certifiedHeight != null}
						<div>
							<dt>certified height</dt>
							<dd>
								{certifiedHeight}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
