<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.KaspaAddressUtxo_Timestamp>, 'prefetched'> = $props()

	const address = $derived(selection.entitySelector.$address)
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
	import KaspaAddressView from '$/views/KaspaAddressView.svelte'
	import UtxoOutputView from '$/views/UtxoOutputView.svelte'
	import KaspaTransactionView from '$/views/KaspaTransactionView.svelte'
</script>


<EntityView
	entityType={EntityType.KaspaAddressUtxo_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/utxo/[outpointTransactionId=stringSegment]/[outpointIndex=nonNegativeInteger]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in address.$network.$network ?
							caip2StringFromValue(address.$network.$network.caip2)
						:
							address.$network.$network.slug
					),
					address: address.address,
					outpointTransactionId: selection.entitySelector.outpointTransactionId,
					outpointIndex: String(selection.entitySelector.outpointIndex),
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
				<dt>Address</dt>
				<dd>
					<KaspaAddressView
						selection={select(EntityType.KaspaAddress, selection.entitySelector.$address)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>outpoint transaction ID</dt>
				<dd>
					{selection.entitySelector.outpointTransactionId}
				</dd>
			</div>

			<div>
				<dt>outpoint index</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.outpointIndex}
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
					viewSelection({
						fields: {
							amountSompi: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amountSompi = entity.amountSompi}
					{#if amountSompi != null}
						<div>
							<dt>amount sompi</dt>
							<dd>
								<NumberValue
									value={amountSompi}
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
							blockDaaScore: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blockDaaScore = entity.blockDaaScore}
					{#if blockDaaScore != null}
						<div>
							<dt>block daa score</dt>
							<dd>
								<NumberValue
									value={blockDaaScore}
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
							isCoinbase: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const isCoinbase = entity.isCoinbase}
					{#if isCoinbase != null}
						<div>
							<dt>is coinbase</dt>
							<dd>
								{isCoinbase ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$output}
			>
				{#snippet children(utxoOutput)}
					{#if utxoOutput != null}
						{@const utxoOutputInitial = untrack(() => utxoOutput)}
						<div>
							<dt>output</dt>
							<dd>
								<UtxoOutputView
									selection={select(EntityType.UtxoOutput, (utxoOutput ?? utxoOutputInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$spendingTransaction}
			>
				{#snippet children(kaspaTransaction)}
					{#if kaspaTransaction != null}
						{@const kaspaTransactionInitial = untrack(() => kaspaTransaction)}
						<div>
							<dt>spending transaction</dt>
							<dd>
								<KaspaTransactionView
									selection={select(EntityType.KaspaTransaction, (kaspaTransaction ?? kaspaTransactionInitial)[EntityMetaKey.Selector])}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
