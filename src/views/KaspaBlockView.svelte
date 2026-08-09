<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.KaspaBlock>, 'prefetched'> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.KaspaExplorer,
			Source.KaspaNode_Grpc,
			Source.KaspaNode_Rest,
			Source.KaspaNode_Wrpc,
		],
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import KaspaAcceptedTransactionsView from '$/views/KaspaAcceptedTransactionsView.svelte'
	import KaspaNetworkView from '$/views/KaspaNetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaBlock}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/block/[blockHash=stringSegment]',
				{
					network: (
						'caip2' in selection.entitySelector.$network.$network ?
							caip2StringFromValue(selection.entitySelector.$network.$network.caip2)
						:
							selection.entitySelector.$network.$network.slug
					),
					blockHash: selection.entitySelector.blockHash,
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
				<dt>network</dt>
				<dd>
					<KaspaNetworkView
						selection={select(EntityType.KaspaNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.blockHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							timestampMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const timestampMs = entity.timestampMs}
					{#if timestampMs != null}
						<div>
							<dt>Timestamp</dt>
							<dd>
								<Timestamp timestamp={timestampMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							blueScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blueScore = entity.blueScore}
					{#if blueScore != null}
						<div>
							<dt>blue score</dt>
							<dd>
								<NumberValue
									value={blueScore}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							daaScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const daaScore = entity.daaScore}
					{#if daaScore != null}
						<div>
							<dt>daa score</dt>
							<dd>
								<NumberValue
									value={daaScore}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							selectedParentHash: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const selectedParentHash = entity.selectedParentHash}
					{#if selectedParentHash != null}
						<div>
							<dt>selected parent hash</dt>
							<dd>
								<TruncatedValue value={selectedParentHash} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>parent hashes</dt>
				<dd>
					<ResourceBoundary
						resource={
							viewSelection({
								fields: {
									parentHashes: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{entity.parentHashes.values.join(', ')}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							utxoCommitment: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const utxoCommitment = entity.utxoCommitment}
					{#if utxoCommitment != null}
						<div>
							<dt>UTXO commitment</dt>
							<dd>
								{utxoCommitment}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const acceptedTransactionsResource = selection.$$acceptedTransactions}
		<ResourceBoundary
			resource={acceptedTransactionsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<KaspaAcceptedTransactionsView
						selection={acceptedTransactionsResource}
						countResource={acceptedTransactionsResource.count}
						title='accepted transactions'
						id='accepted-transactions'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
