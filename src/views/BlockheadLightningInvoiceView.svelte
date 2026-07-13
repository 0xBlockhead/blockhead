<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'
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
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadLightningInvoice>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadLightningInvoice>>
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
	const blockheadLightningInvoice = $derived(selection({
		sources: [
			Source.LightningLnd_Rest,
		],
		fields: {
			memo: true,
			valueMsat: true,
			paymentRequest: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.memo) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice')
	const viewDomId = $derived('blockhead-lightning-invoice-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


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
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.$network !== undefined && pendingEntity.$network.slug !== undefined && pendingEntity.paymentHash !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/invoices/[paymentHash=stringSegment]', {
			network: String(pendingEntity.$network.slug ?? ''),
			paymentHash: String(pendingEntity.paymentHash ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadLightningInvoice}>
			{#snippet Pending()}
				{[String((pendingEntity.memo) ?? '')].filter(Boolean).join(' ') || title || [String((pendingEntity.paymentHash) ?? '')].filter(Boolean).join(' ') || 'Lightning invoice'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.memo) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadLightningInvoice}>
			{#snippet Pending()}
				{@const valueMsat0 = pendingEntity.valueMsat}
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
							{@const paymentHash = pendingEntity.paymentHash}
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
							(selection.entitySelector.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(caip2StringFromValue(selection.entitySelector.$network.caip2) ?? ''),
							}) : selection.entitySelector.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]', {
								network: String(selection.entitySelector.$network.slug ?? ''),
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
					{@const valueMsat = pendingEntity.valueMsat}
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
					{@const createdAtMs = pendingEntity.createdAtMs}
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
							expirySeconds: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const expirySeconds = pendingEntity.expirySeconds}
					{#if expirySeconds !== undefined && expirySeconds !== null}
						<div>
							<dt>Expiry seconds</dt>
							<dd>
								<NumberValue value={Number(expirySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const expirySeconds = resolvedEntity.expirySeconds}
					{#if expirySeconds !== undefined && expirySeconds !== null}
						<div>
							<dt>Expiry seconds</dt>
							<dd>
								<NumberValue value={Number(expirySeconds)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							private: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const privateValue = pendingEntity.private}
					{#if privateValue !== undefined && privateValue !== null}
						<div>
							<dt>Private</dt>
							<dd>
								{privateValue ? 'Yes' : 'No'}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const privateValue = resolvedEntity.private}
					{#if privateValue !== undefined && privateValue !== null}
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
					selection({
						fields: {
							addIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const addIndex = pendingEntity.addIndex}
					{#if addIndex !== undefined && addIndex !== null}
						<div>
							<dt>Add index</dt>
							<dd>
								<NumberValue value={Number(addIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addIndex = resolvedEntity.addIndex}
					{#if addIndex !== undefined && addIndex !== null}
						<div>
							<dt>Add index</dt>
							<dd>
								<NumberValue value={Number(addIndex)} />
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
				{#snippet Pending()}{/snippet}

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
				resource={
					selection({
						fields: {
							paymentRequest: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const paymentRequest = pendingEntity.paymentRequest}
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
			<BlockheadLightningInvoice_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='Observations'
				emptyText='No observations yet.'
				id='BlockheadLightningInvoice_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
