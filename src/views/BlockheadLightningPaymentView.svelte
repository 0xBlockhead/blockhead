<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import { EntityProxyField, type EntityProxyData, type EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
	import { networkByCaip2 } from '$/constants/Network.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningPayment>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningPayment>>
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
	const blockheadLightningPayment = $derived(selection({
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			valueMsat: true,
			paymentRequest: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.paymentHash ?? prefetched.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment')
	const viewDomId = $derived('blockhead-lightning-payment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.paymentHash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments/[paymentHash]', {
			networkSlug: String(pendingEntity.$network.slug ?? ''),
			paymentHash: String(pendingEntity.paymentHash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningPayment}>
			{#snippet Pending()}
				{@const paymentHash0 = selection.entitySelector.paymentHash ?? prefetched.paymentHash}
				{#if paymentHash0 !== undefined && paymentHash0 !== null}
					<TruncatedValue value={String((paymentHash0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const paymentHash0 = resolvedEntity.paymentHash}
				{#if paymentHash0 !== undefined && paymentHash0 !== null}
					<TruncatedValue value={String((paymentHash0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningPayment}>
			{#snippet Pending()}
				{@const valueMsat0 = prefetched.valueMsat}
				{#if valueMsat0 !== undefined && valueMsat0 !== null}
					<NumberValue value={Number(valueMsat0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const valueMsat0 = resolvedEntity.valueMsat}
				{#if valueMsat0 !== undefined && valueMsat0 !== null}
					<NumberValue value={Number(valueMsat0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Payment hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									paymentHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const paymentHash = selection.entitySelector.paymentHash ?? prefetched.paymentHash}
							{#if paymentHash !== undefined && paymentHash !== null}
								<TruncatedValue value={String((paymentHash) ?? '')} />
							{/if}
						{/snippet}

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
						selection={select(EntityType.Network, selection.entitySelector.$network, {})}
						href={
							(selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('CosmosSdk') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]/cosmos', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('Evm') && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=eip155NetworkSlug]', {
								networkSlug: String(networkByCaip2[String(String(selection.entitySelector.$network.caip2.namespace) + ':' + String(selection.entitySelector.$network.caip2.reference))].slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('SolanaRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/solana', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.executionModels !== undefined && selection.entitySelector.$network.executionModels.values.includes('PolkadotRuntime') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.ledgerModels !== undefined && selection.entitySelector.$network.ledgerModels.values.includes('Utxo') && selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.namespace !== undefined && selection.entitySelector.$network.caip2 !== undefined && selection.entitySelector.$network.caip2.reference !== undefined ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace ?? '')}:${String(selection.entitySelector.$network.caip2.reference ?? '')}`,
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							valueMsat: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const valueMsat = prefetched.valueMsat}
					{#if valueMsat !== undefined && valueMsat !== null}
						<div>
							<dt>Value msat</dt>
							<dd>
								<NumberValue value={Number(valueMsat)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const valueMsat = resolvedEntity.valueMsat}
					{#if valueMsat !== undefined && valueMsat !== null}
						<div>
							<dt>Value msat</dt>
							<dd>
								<NumberValue value={Number(valueMsat)} />
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
						fields: {
							createdAtMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const createdAtMs = prefetched.createdAtMs}
					{#if createdAtMs !== undefined && createdAtMs !== null}
						<div>
							<dt>Created</dt>
							<dd>
								<Timestamp timestamp={Number(createdAtMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							paymentIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentIndex = prefetched.paymentIndex}
					{#if paymentIndex !== undefined && paymentIndex !== null}
						<div>
							<dt>Payment index</dt>
							<dd>
								<NumberValue value={Number(paymentIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const paymentIndex = resolvedEntity.paymentIndex}
					{#if paymentIndex !== undefined && paymentIndex !== null}
						<div>
							<dt>Payment index</dt>
							<dd>
								<NumberValue value={Number(paymentIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.BlockheadLightningNodeState, false>('$localNodeState')}
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
				resource={selection[EntityProxyField]<EntityType.BlockheadLightningInvoice, false>('$invoice')}
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
										(blockheadLightningInvoice[EntityMetaKey.Selector].$network !== undefined && blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug !== undefined && blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash !== undefined ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices/[paymentHash]', {
											networkSlug: String(blockheadLightningInvoice[EntityMetaKey.Selector].$network.slug ?? ''),
											paymentHash: String(blockheadLightningInvoice[EntityMetaKey.Selector].paymentHash ?? ''),
										}) : undefined)
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
						fields: {
							paymentRequest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentRequest = prefetched.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String((paymentRequest) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

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
		{#if detailsOpen}
			<BlockheadLightningPayment_TimestampsView
				selection={selection[EntityProxyField]<EntityType.BlockheadLightningPayment_Timestamp>('$$timestamps')}
				title='Observations'
				emptyText='No observations yet.'
				id='BlockheadLightningPayment_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
