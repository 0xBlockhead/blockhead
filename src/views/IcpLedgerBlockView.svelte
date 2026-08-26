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
	}: Omit<EntitySelectionViewProps<EntityType.IcpLedgerBlock>, 'prefetched'> = $props()


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import IcpLedgerCanisterView from '$/views/IcpLedgerCanisterView.svelte'
</script>


<EntityView
	entityType={EntityType.IcpLedgerBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'ICP ledger block'}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/canister/[canisterId=stringSegment]/(icpCanister)/ledger/(icpLedgerCanister)/block/[blockIndex=nonNegativeBigInt]',
				{
					network: (
						'caip2' in selection.entitySelector.$ledger.$canister.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$ledger.$canister.$network.$network.caip2)
						:
							selection.entitySelector.$ledger.$canister.$network.$network.slug
					),
					canisterId: selection.entitySelector.$ledger.$canister.canisterId,
					blockIndex: String(selection.entitySelector.blockIndex),
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
				<dt>ledger</dt>
				<dd>
					<IcpLedgerCanisterView
						selection={select(EntityType.IcpLedgerCanister, selection.entitySelector.$ledger)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>block index</dt>
				<dd>
					{selection.entitySelector.blockIndex}
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockHash = entity.blockHash}
					{#if blockHash != null}
						<div>
							<dt>Block hash</dt>
							<dd>
								<TruncatedValue value={blockHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							parentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const parentHash = entity.parentHash}
					{#if parentHash != null}
						<div>
							<dt>parent hash</dt>
							<dd>
								<TruncatedValue value={parentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							timestampNs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampNs = entity.timestampNs}
					{#if timestampNs != null}
						<div>
							<dt>timestamp ns</dt>
							<dd>
								{timestampNs}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const transactionCount = entity.transactionCount}
					{#if transactionCount != null}
						<div>
							<dt>transaction count</dt>
							<dd>
								{transactionCount}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							archiveCanisterId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const archiveCanisterId = entity.archiveCanisterId}
					{#if archiveCanisterId != null}
						<div>
							<dt>archive canister ID</dt>
							<dd>
								{archiveCanisterId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
