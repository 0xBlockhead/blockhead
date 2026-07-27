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
	}: EntitySelectionViewProps<EntityType.BlockheadLightningInvoice> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.LightningLnd_Rest,
		],
	}))
	const blockheadLightningInvoice = $derived(viewSelection({
		fields: {
			memo: true,
			valueMsat: true,
			paymentRequest: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.memo ?? '') || (pendingEntity.paymentHash ?? '') || 'Lightning invoice')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadLightningInvoice_TimestampsView from '$/views/BlockheadLightningInvoice_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadLightningNodeStateView from '$/views/BlockheadLightningNodeStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningInvoice}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/invoices/[paymentHash=stringSegment]',
			{
				network: (
					'caip2' in selection.entitySelector.$network ?
						String(caip2StringFromValue(selection.entitySelector.$network.caip2))
					:
						String(selection.entitySelector.$network.slug)
				),
				paymentHash: String(selection.entitySelector.paymentHash),
			}
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningInvoice}>
			{#snippet children(entity)}
				{(entity.memo ?? '') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningInvoice}>
			{#snippet children(entity)}
				{@const valueMsat0 = entity.valueMsat}
				{#if valueMsat0 != null}
					<NumberValue
						value={valueMsat0}
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
					<TruncatedValue value={pendingEntity.paymentHash} />
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
				resource={blockheadLightningInvoice}
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
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							expirySeconds: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const expirySeconds = entity.expirySeconds}
					{#if expirySeconds != null}
						<div>
							<dt>Expiry seconds</dt>
							<dd>
								<NumberValue
									value={expirySeconds}
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
							private: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const privateValue = entity.private}
					{#if privateValue != null}
						<div>
							<dt>Private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							addIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const addIndex = entity.addIndex}
					{#if addIndex != null}
						<div>
							<dt>Add index</dt>
							<dd>
								<NumberValue
									value={addIndex}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
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
				resource={blockheadLightningInvoice}
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
		{@const blockheadLightningInvoiceBlockheadLightningInvoiceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLightningInvoiceBlockheadLightningInvoiceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BlockheadLightningInvoice_TimestampsView
						selection={blockheadLightningInvoiceBlockheadLightningInvoiceTimestampsViewTimestampsResource}
						countResource={blockheadLightningInvoiceBlockheadLightningInvoiceTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
