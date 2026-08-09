<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.IcpCanister_Timestamp>, 'prefetched'> = $props()

	const canister = $derived(selection.entitySelector.$canister)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpCanister_Timestamp}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP canister timestamp'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in canister.$network.$network ?
							caip2StringFromValue(canister.$network.$network.caip2)
						:
							canister.$network.$network.slug
					),
					canisterId: canister.canisterId,
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
				<dt>canister</dt>
				<dd>
					<IcpCanisterView
						selection={select(EntityType.IcpCanister, selection.entitySelector.$canister)}
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
				resource={selection.$subnet}
			>
				{#snippet children(icpSubnet)}
					{#if icpSubnet != null}
						<div>
							<dt>subnet</dt>
							<dd>
								<IcpSubnetView
									selection={select(EntityType.IcpSubnet, icpSubnet[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							subnetId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const subnetId = entity.subnetId}
					{#if subnetId != null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{subnetId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterKind: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canisterKind = entity.canisterKind}
					{#if canisterKind != null}
						<div>
							<dt>canister kind</dt>
							<dd>
								{canisterKind}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							candidInterfaceHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const candidInterfaceHash = entity.candidInterfaceHash}
					{#if candidInterfaceHash != null}
						<div>
							<dt>candid interface hash</dt>
							<dd>
								<TruncatedValue value={candidInterfaceHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							status: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const status = entity.status}
					{#if status != null}
						<div>
							<dt>status</dt>
							<dd>
								{status}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							moduleHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const moduleHash = entity.moduleHash}
					{#if moduleHash != null}
						<div>
							<dt>module hash</dt>
							<dd>
								<TruncatedValue value={moduleHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>controllers</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									controllers: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.controllers.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							cyclesBalance: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const cyclesBalance = entity.cyclesBalance}
					{#if cyclesBalance != null}
						<div>
							<dt>cycles balance</dt>
							<dd>
								{cyclesBalance}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memorySizeBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memorySizeBytes = entity.memorySizeBytes}
					{#if memorySizeBytes != null}
						<div>
							<dt>memory size bytes</dt>
							<dd>
								{memorySizeBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							freezingThresholdSeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const freezingThresholdSeconds = entity.freezingThresholdSeconds}
					{#if freezingThresholdSeconds != null}
						<div>
							<dt>freezing threshold seconds</dt>
							<dd>
								{freezingThresholdSeconds}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							idleCyclesBurnedPerDay: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const idleCyclesBurnedPerDay = entity.idleCyclesBurnedPerDay}
					{#if idleCyclesBurnedPerDay != null}
						<div>
							<dt>idle cycles burned per day</dt>
							<dd>
								{idleCyclesBurnedPerDay}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							canisterVersion: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const canisterVersion = entity.canisterVersion}
					{#if canisterVersion != null}
						<div>
							<dt>canister version</dt>
							<dd>
								{canisterVersion}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							reservedCycles: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const reservedCycles = entity.reservedCycles}
					{#if reservedCycles != null}
						<div>
							<dt>reserved cycles</dt>
							<dd>
								{reservedCycles}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
