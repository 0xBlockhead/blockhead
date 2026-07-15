<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
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
			selection: RegisteredEntityProxyResource<EntityType.UtxoAddress_Timestamp>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.UtxoAddress_Timestamp>>
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
	const utxoAddressTimestamp = $derived(selection({
		fields: {
			balanceSats: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp')
	const viewDomId = $derived('utxo-address-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress_Timestamp}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? (pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$address !== undefined && pendingEntity.$address.address !== undefined && pendingEntity.$address.$network !== undefined && pendingEntity.$address.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$address.address ?? ''),
			network: String(caip2StringFromValue(pendingEntity.$address.$network.caip2) ?? ''),
		}) : pendingEntity.timestampMs !== undefined && pendingEntity.source !== undefined && pendingEntity.$address !== undefined && pendingEntity.$address.address !== undefined && pendingEntity.$address.$network !== undefined && pendingEntity.$address.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
			timestampMs: String(pendingEntity.timestampMs ?? ''),
			source: String(pendingEntity.source ?? ''),
			address: String(pendingEntity.$address.address ?? ''),
			network: String(pendingEntity.$address.$network.slug ?? ''),
		}) : undefined)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={utxoAddressTimestamp}>
			{#snippet Pending()}
				{@const timestampMs0 = pendingEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const timestampMs0 = resolvedEntity.timestampMs}
				{#if timestampMs0 !== undefined && timestampMs0 !== null}
					<Timestamp timestamp={Number(timestampMs0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={utxoAddressTimestamp}>
			{#snippet Pending()}
				{@const balanceSats0 = pendingEntity.balanceSats}
				{#if balanceSats0 !== undefined && balanceSats0 !== null}
					<NumberValue value={Number(balanceSats0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const balanceSats0 = resolvedEntity.balanceSats}
				{#if balanceSats0 !== undefined && balanceSats0 !== null}
					<NumberValue value={Number(balanceSats0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={utxoAddressTimestamp}>
			{#snippet Pending()}
				{@const source0 = pendingEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const source0 = resolvedEntity.source}
				{#if source0 !== undefined && source0 !== null}
					<span data-text="muted">
						{String((source0) ?? '')}
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						fields: {
							balanceSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const balanceSats = pendingEntity.balanceSats}
					{#if balanceSats !== undefined && balanceSats !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue value={Number(balanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceSats = resolvedEntity.balanceSats}
					{#if balanceSats !== undefined && balanceSats !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue value={Number(balanceSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							transactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const transactionCount = pendingEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const transactionCount = resolvedEntity.transactionCount}
					{#if transactionCount !== undefined && transactionCount !== null}
						<div>
							<dt>Transaction count</dt>
							<dd>
								{String((transactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fundedOutputCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fundedOutputCount = pendingEntity.fundedOutputCount}
					{#if fundedOutputCount !== undefined && fundedOutputCount !== null}
						<div>
							<dt>Funded output count</dt>
							<dd>
								{String((fundedOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundedOutputCount = resolvedEntity.fundedOutputCount}
					{#if fundedOutputCount !== undefined && fundedOutputCount !== null}
						<div>
							<dt>Funded output count</dt>
							<dd>
								{String((fundedOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							fundedValueSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const fundedValueSats = pendingEntity.fundedValueSats}
					{#if fundedValueSats !== undefined && fundedValueSats !== null}
						<div>
							<dt>Funded value</dt>
							<dd>
								<NumberValue value={Number(fundedValueSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundedValueSats = resolvedEntity.fundedValueSats}
					{#if fundedValueSats !== undefined && fundedValueSats !== null}
						<div>
							<dt>Funded value</dt>
							<dd>
								<NumberValue value={Number(fundedValueSats)} />
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
							spentOutputCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spentOutputCount = pendingEntity.spentOutputCount}
					{#if spentOutputCount !== undefined && spentOutputCount !== null}
						<div>
							<dt>Spent output count</dt>
							<dd>
								{String((spentOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentOutputCount = resolvedEntity.spentOutputCount}
					{#if spentOutputCount !== undefined && spentOutputCount !== null}
						<div>
							<dt>Spent output count</dt>
							<dd>
								{String((spentOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							spentValueSats: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const spentValueSats = pendingEntity.spentValueSats}
					{#if spentValueSats !== undefined && spentValueSats !== null}
						<div>
							<dt>Spent value</dt>
							<dd>
								<NumberValue value={Number(spentValueSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentValueSats = resolvedEntity.spentValueSats}
					{#if spentValueSats !== undefined && spentValueSats !== null}
						<div>
							<dt>Spent value</dt>
							<dd>
								<NumberValue value={Number(spentValueSats)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							unspentOutputCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const unspentOutputCount = pendingEntity.unspentOutputCount}
					{#if unspentOutputCount !== undefined && unspentOutputCount !== null}
						<div>
							<dt>Unspent output count</dt>
							<dd>
								{String((unspentOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const unspentOutputCount = resolvedEntity.unspentOutputCount}
					{#if unspentOutputCount !== undefined && unspentOutputCount !== null}
						<div>
							<dt>Unspent output count</dt>
							<dd>
								{String((unspentOutputCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							mempoolTransactionCount: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const mempoolTransactionCount = pendingEntity.mempoolTransactionCount}
					{#if mempoolTransactionCount !== undefined && mempoolTransactionCount !== null}
						<div>
							<dt>Mempool transaction count</dt>
							<dd>
								{String((mempoolTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const mempoolTransactionCount = resolvedEntity.mempoolTransactionCount}
					{#if mempoolTransactionCount !== undefined && mempoolTransactionCount !== null}
						<div>
							<dt>Mempool transaction count</dt>
							<dd>
								{String((mempoolTransactionCount) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Timestamp</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									timestampMs: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const timestampMs = pendingEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const timestampMs = resolvedEntity.timestampMs}
							{#if timestampMs !== undefined && timestampMs !== null}
								<Timestamp timestamp={Number(timestampMs)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Source</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									source: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const source = pendingEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const source = resolvedEntity.source}
							{#if source !== undefined && source !== null}
								{String((source) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Address</dt>
				<dd>
					<UtxoAddressView
						selection={select(EntityType.UtxoAddress, selection.entitySelector.$address, {})}
						href={
							(selection.entitySelector.$address.address !== undefined && selection.entitySelector.$address.$network !== undefined && selection.entitySelector.$address.$network.caip2 !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
								address: String(selection.entitySelector.$address.address ?? ''),
								network: String(caip2StringFromValue(selection.entitySelector.$address.$network.caip2) ?? ''),
							}) : selection.entitySelector.$address.address !== undefined && selection.entitySelector.$address.$network !== undefined && selection.entitySelector.$address.$network.slug !== undefined ? resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
								address: String(selection.entitySelector.$address.address ?? ''),
								network: String(selection.entitySelector.$address.$network.slug ?? ''),
							}) : undefined)
						}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
