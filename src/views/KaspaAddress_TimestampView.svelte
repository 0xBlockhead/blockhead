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
	}: Omit<EntitySelectionViewProps<EntityType.KaspaAddress_Timestamp>, 'prefetched'> = $props()

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
</script>


<EntityView
	entityType={EntityType.KaspaAddress_Timestamp}
	entitySelector={selection.entitySelector}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]/(selection)/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]',
				{
					network: (
						'caip2' in address.$network.$network ?
							caip2StringFromValue(address.$network.$network.caip2)
						:
							address.$network.$network.slug
					),
					address: address.address,
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
							balanceSompi: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const balanceSompi = entity.balanceSompi}
					{#if balanceSompi != null}
						<div>
							<dt>balance sompi</dt>
							<dd>
								<NumberValue
									value={balanceSompi}
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
							utxoCount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const utxoCount = entity.utxoCount}
					{#if utxoCount != null}
						<div>
							<dt>UTXO count</dt>
							<dd>
								<NumberValue
									value={utxoCount}
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
								<NumberValue
									value={transactionCount}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
