<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'
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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningPayment> = $props()

	const network = $derived(selection.entitySelector.$network)
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
		],
	}))
	const blockheadLightningPayment = $derived(viewSelection({
		fields: {
			valueMsat: true,
			paymentRequest: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningPayment_TimestampsView from '$/views/BlockheadLightningPayment_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningPayment}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.paymentHash || 'Lightning payment')}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/payments/[paymentHash=stringSegment]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					paymentHash: selection.entitySelector.paymentHash,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.paymentHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningPayment}>
			{#snippet children(entity)}
				{@const valueMsat = entity.valueMsat}
				{#if valueMsat != null}
					<NumberValue
						value={valueMsat}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Payment hash</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.paymentHash} />
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={blockheadLightningPayment}
			>
				{#snippet children(entity)}
					{@const valueMsat = entity.valueMsat}
					{#if valueMsat != null}
						<div>
							<dt>Value msat</dt>
							<dd>
								<NumberValue
									value={valueMsat}
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
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const createdAtMs = entity.createdAtMs}
					{#if createdAtMs != null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={createdAtMs} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							paymentIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const paymentIndex = entity.paymentIndex}
					{#if paymentIndex != null}
						<div>
							<dt>Payment index</dt>
							<dd>
								<NumberValue
									value={paymentIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$localNodeState}
			>
				{#snippet children(blockheadLightningNodeState)}
					{#if blockheadLightningNodeState != null}
						<div>
							<dt>Local node state</dt>
							<dd>
								<BlockheadLightningNodeStateView
									selection={select(EntityType.BlockheadLightningNodeState, blockheadLightningNodeState[EntityMetaKey.Selector])}
									prefetched={blockheadLightningNodeState}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$invoice}
			>
				{#snippet children(blockheadLightningInvoice)}
					{#if blockheadLightningInvoice != null}
						<div>
							<dt>Invoice</dt>
							<dd>
								<BlockheadLightningInvoiceView
									selection={select(EntityType.BlockheadLightningInvoice, blockheadLightningInvoice[EntityMetaKey.Selector])}
									prefetched={blockheadLightningInvoice}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={blockheadLightningPayment}
			>
				{#snippet children(entity)}
					{@const paymentRequest = entity.paymentRequest}
					{#if paymentRequest != null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={paymentRequest} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningPayment_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
