<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AlgorandTransactionProof>, 'prefetched'> = $props()

	const transaction = $derived(selection.entitySelector.$transaction)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AlgorandTransactionView from '$/views/AlgorandTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.AlgorandTransactionProof}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(algorand)/algorand/transaction/[txId=stringSegment]/(algorandTransaction)/proof/[round=nonNegativeBigInt]/[hashType=stringSegment]/[source=stringSegment]',
				{
					network: (
						'caip2' in transaction.$network.$network ?
							caip2StringFromValue(transaction.$network.$network.caip2)
						:
							transaction.$network.$network.slug
					),
					txId: transaction.txId,
					round: String(selection.entitySelector.round),
					hashType: selection.entitySelector.hashType,
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
				<dt>transaction</dt>
				<dd>
					<AlgorandTransactionView
						selection={select(EntityType.AlgorandTransaction, selection.entitySelector.$transaction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>round</dt>
				<dd>
					{selection.entitySelector.round}
				</dd>
			</div>

			<div>
				<dt>hash type</dt>
				<dd>
					{selection.entitySelector.hashType}
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					{selection.entitySelector.source}
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							proofBytes: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const proofBytes = entity.proofBytes}
					{#if proofBytes != null}
						<div>
							<dt>proof bytes</dt>
							<dd>
								{proofBytes}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							stibHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const stibHash = entity.stibHash}
					{#if stibHash != null}
						<div>
							<dt>stib hash</dt>
							<dd>
								<TruncatedValue value={stibHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							treeDepth: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const treeDepth = entity.treeDepth}
					{#if treeDepth != null}
						<div>
							<dt>tree depth</dt>
							<dd>
								{treeDepth}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
