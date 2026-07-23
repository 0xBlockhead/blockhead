<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadLightningPayment>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadLightningPayment>
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
	const blockheadLightningPayment = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			valueMsat: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			valueMsat: true,
			paymentRequest: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment')
	const viewDomId = $derived('blockhead-lightning-payment-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (
			selection.entitySelector != null && 'paymentHash' in selection.entitySelector
			&& selection.entitySelector.paymentHash != null
			&& selection.entitySelector != null && '$network' in selection.entitySelector ?
				selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
				&& selection.entitySelector.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/payments/[paymentHash=stringSegment]', {
				paymentHash: String(selection.entitySelector.paymentHash ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
					&& selection.entitySelector.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/payments/[paymentHash=stringSegment]', {
					paymentHash: String(selection.entitySelector.paymentHash ?? ''),
					network: String(selection.entitySelector.$network.slug ?? ''),
				})
				:
					undefined
		:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'valueMsat')}
			{@const paymentHash0 = pendingEntity.paymentHash}
			{#if paymentHash0 !== undefined && paymentHash0 !== null}
				<TruncatedValue value={String((paymentHash0) ?? '')} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentHash0 = resolvedEntity.paymentHash}
					{#if paymentHash0 !== undefined && paymentHash0 !== null}
						<TruncatedValue value={String((paymentHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'valueMsat')}
			{@const valueMsat0 = pendingEntity.valueMsat}
			{#if valueMsat0 !== undefined && valueMsat0 !== null}
				<NumberValue
					value={valueMsat0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueMsat0 = resolvedEntity.valueMsat}
					{#if valueMsat0 !== undefined && valueMsat0 !== null}
						<NumberValue
							value={valueMsat0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Payment hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									paymentHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const paymentHash = resolvedEntity.paymentHash}
							{#if paymentHash !== undefined && paymentHash !== null}
								<TruncatedValue value={String((paymentHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(
								selection.entitySelector.$network != null && 'caip2' in selection.entitySelector.$network
								&& selection.entitySelector.$network.caip2 != null ?
									resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							})
							:
									selection.entitySelector.$network != null && 'slug' in selection.entitySelector.$network
									&& selection.entitySelector.$network.slug != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]', {
									network: String(selection.entitySelector.$network.slug ?? ''),
								})
								:
									undefined
							)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							valueMsat: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueMsat = resolvedEntity.valueMsat}
					{#if valueMsat !== undefined && valueMsat !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const createdAtMs = resolvedEntity.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
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
					selection({
						sources: selection.sources,
						fields: {
							paymentIndex: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentIndex = resolvedEntity.paymentIndex}
					{#if paymentIndex !== undefined && paymentIndex !== null}
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
					{#if blockheadLightningNodeState != null && blockheadLightningNodeState[EntityMetaKey.Selector] != null}
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
					{#if blockheadLightningInvoice != null && blockheadLightningInvoice[EntityMetaKey.Selector] != null}
						<div>
							<dt>Invoice</dt>
							<dd>
								<BlockheadLightningInvoiceView
									selection={select(EntityType.BlockheadLightningInvoice, blockheadLightningInvoice[EntityMetaKey.Selector])}
									prefetched={blockheadLightningInvoice}
									href={
										(
											blockheadLightningInvoice[EntityMetaKey.Selector] != null && 'paymentHash' in blockheadLightningInvoice[EntityMetaKey.Selector]
											&& blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash != null
											&& blockheadLightningInvoice[EntityMetaKey.Selector] != null && '$network' in blockheadLightningInvoice[EntityMetaKey.Selector] ?
												blockheadLightningInvoice[EntityMetaKey.Selector].$network != null && 'caip2' in blockheadLightningInvoice[EntityMetaKey.Selector].$network
												&& blockheadLightningInvoice[EntityMetaKey.Selector].$network.caip2 != null ?
													resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
												paymentHash: String(blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash ?? ''),
												network: String(caip2StringFromValue(blockheadLightningInvoice[EntityMetaKey.Selector].$network.caip2) ?? ''),
											})
											:
													blockheadLightningInvoice[EntityMetaKey.Selector].$network != null && 'slug' in blockheadLightningInvoice[EntityMetaKey.Selector].$network
													&& blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug != null ?
														resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
													paymentHash: String(blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash ?? ''),
													network: String(blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug ?? ''),
												})
												:
													undefined
										:
												undefined
										)
									}
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
				resource={
					selection({
						sources: selection.sources,
						fields: {
							paymentRequest: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentRequest = resolvedEntity.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String((paymentRequest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadLightningPaymentBlockheadLightningPaymentTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadLightningPaymentBlockheadLightningPaymentTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadLightningPayment_TimestampsView
					selection={blockheadLightningPaymentBlockheadLightningPaymentTimestampsViewTimestampsResource}
					countResource={blockheadLightningPaymentBlockheadLightningPaymentTimestampsViewTimestampsResource.count}
					title='Observations'
					id='BlockheadLightningPayment_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
