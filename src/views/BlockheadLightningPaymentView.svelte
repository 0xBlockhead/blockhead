<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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

	const blockheadLightningPayment = $derived(selection({
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			valueMsat: true,
			paymentRequest: true,
			...(open && {
				createdAtMs: true,
				paymentIndex: true,
				$localNodeState: true,
				$invoice: true,
				$$timestamps: true,
			}),
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning payment')
	const viewDomId = $derived('blockhead-lightning-payment-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import BlockheadLightningInvoiceView from '$/views/BlockheadLightningInvoiceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadLightningPayment}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/payments/[paymentHash]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$network.slug),
			paymentHash: String(({ ...selection.entitySelector, ...prefetched }).paymentHash),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const paymentHash0 = ({ ...selection.entitySelector, ...prefetched }).paymentHash}
			{#if paymentHash0 !== undefined && paymentHash0 !== null}
				<TruncatedValue value={String(paymentHash0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet Pending()}
					{@const paymentHash0 = ({ ...selection.entitySelector, ...prefetched }).paymentHash}
					{#if paymentHash0 !== undefined && paymentHash0 !== null}
						<TruncatedValue value={String(paymentHash0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const paymentHash0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).paymentHash}
					{#if paymentHash0 !== undefined && paymentHash0 !== null}
						<TruncatedValue value={String(paymentHash0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched }).valueMsat}
			{#if valueMsat0 !== undefined && valueMsat0 !== null}
				<NumberValue value={Number(valueMsat0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet Pending()}
					{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched }).valueMsat}
					{#if valueMsat0 !== undefined && valueMsat0 !== null}
						<NumberValue value={Number(valueMsat0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const valueMsat0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).valueMsat}
					{#if valueMsat0 !== undefined && valueMsat0 !== null}
						<NumberValue value={Number(valueMsat0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						href={
							(selection.entitySelector.$network?.caip2 != null && selection.entitySelector.$network?.caip2?.namespace != null && selection.entitySelector.$network?.caip2?.reference != null ? resolve('/(explore)/(networks)/network/[caip2=networkCaip2]', {
								caip2: `${String(selection.entitySelector.$network.caip2.namespace)}:${String(selection.entitySelector.$network.caip2.reference)}`,
							}) : selection.entitySelector.$network?.slug != null ? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
								networkSlug: String(selection.entitySelector.$network.slug),
							}) : undefined)
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet Pending()}
					{@const createdAtMs = prefetched.createdAtMs ?? selection.entitySelector.createdAtMs}
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
					{@const createdAtMs = entity.createdAtMs ?? selection.entitySelector.createdAtMs ?? prefetched.createdAtMs}
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

			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet Pending()}
					{@const paymentIndex = prefetched.paymentIndex ?? selection.entitySelector.paymentIndex}
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
					{@const paymentIndex = entity.paymentIndex ?? selection.entitySelector.paymentIndex ?? prefetched.paymentIndex}
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
				resource={selection[EntityProxyField]<EntityType.BlockheadLightningInvoice, false>('$invoice')}
			>
				{#snippet children(blockheadLightningInvoice)}
					{#if blockheadLightningInvoice != null}
						<div>
							<dt>Invoice</dt>
							<dd>
								<BlockheadLightningInvoiceView
									selection={select(EntityType.BlockheadLightningInvoice, blockheadLightningInvoice.entitySelector)}
									prefetched={blockheadLightningInvoice}
									href={
										resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/invoices/[paymentHash]', {
											networkSlug: String(blockheadLightningInvoice.entitySelector.$network.slug),
											paymentHash: String(blockheadLightningInvoice.entitySelector.paymentHash),
										})
									}
									layout={EntityLayout.Title}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary resource={blockheadLightningPayment}>
				{#snippet Pending()}
					{@const paymentRequest = prefetched.paymentRequest ?? selection.entitySelector.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String(paymentRequest)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const paymentRequest = entity.paymentRequest ?? selection.entitySelector.paymentRequest ?? prefetched.paymentRequest}
					{#if paymentRequest !== undefined && paymentRequest !== null}
						<div>
							<dt>Payment request</dt>
							<dd>
								<TruncatedValue value={String(paymentRequest)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
