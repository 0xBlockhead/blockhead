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
			selection: RegisteredEntityProxyResource<EntityType.UtxoAddress_Timestamp>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.UtxoAddress_Timestamp>
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
	const utxoAddressTimestamp = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			balanceSats: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			balanceSats: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp')
	const viewDomId = $derived('utxo-address-timestamp-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


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
		href ?? (
			selection.entitySelector != null && 'timestampMs' in selection.entitySelector
			&& selection.entitySelector.timestampMs != null
			&& selection.entitySelector != null && 'source' in selection.entitySelector
			&& selection.entitySelector.source != null
			&& selection.entitySelector != null && '$address' in selection.entitySelector
			&& selection.entitySelector.$address != null && 'address' in selection.entitySelector.$address
			&& selection.entitySelector.$address.address != null
			&& selection.entitySelector.$address != null && '$network' in selection.entitySelector.$address ?
				selection.entitySelector.$address.$network != null && 'caip2' in selection.entitySelector.$address.$network
				&& selection.entitySelector.$address.$network.caip2 != null ?
					resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
				timestampMs: String(selection.entitySelector.timestampMs ?? ''),
				source: String(selection.entitySelector.source ?? ''),
				address: String(selection.entitySelector.$address.address ?? ''),
				network: String(caip2StringFromValue(selection.entitySelector.$address.$network.caip2) ?? ''),
			})
			:
					selection.entitySelector.$address.$network != null && 'slug' in selection.entitySelector.$address.$network
					&& selection.entitySelector.$address.$network.slug != null ?
						resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]/observations/[timestampMs=nonNegativeInteger]/[source=stringSegment]', {
					timestampMs: String(selection.entitySelector.timestampMs ?? ''),
					source: String(selection.entitySelector.source ?? ''),
					address: String(selection.entitySelector.$address.address ?? ''),
					network: String(selection.entitySelector.$address.$network.slug ?? ''),
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
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'balanceSats')}
			{@const timestampMs0 = pendingEntity.timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const timestampMs0 = resolvedEntity.timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'balanceSats')}
			{@const balanceSats0 = pendingEntity.balanceSats}
			{#if balanceSats0 !== undefined && balanceSats0 !== null}
				<NumberValue
					value={balanceSats0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceSats0 = resolvedEntity.balanceSats}
					{#if balanceSats0 !== undefined && balanceSats0 !== null}
						<NumberValue
							value={balanceSats0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'balanceSats')}
			{@const source0 = pendingEntity.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
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
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							balanceSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const balanceSats = resolvedEntity.balanceSats}
					{#if balanceSats !== undefined && balanceSats !== null}
						<div>
							<dt>Balance</dt>
							<dd>
								<NumberValue
									value={balanceSats}
								/>
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
							transactionCount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							fundedOutputCount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							fundedValueSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const fundedValueSats = resolvedEntity.fundedValueSats}
					{#if fundedValueSats !== undefined && fundedValueSats !== null}
						<div>
							<dt>Funded value</dt>
							<dd>
								<NumberValue
									value={fundedValueSats}
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
							spentOutputCount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							spentValueSats: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const spentValueSats = resolvedEntity.spentValueSats}
					{#if spentValueSats !== undefined && spentValueSats !== null}
						<div>
							<dt>Spent value</dt>
							<dd>
								<NumberValue
									value={spentValueSats}
								/>
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
							unspentOutputCount: true,
						},
					})
				}
			>
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
						sources: selection.sources,
						fields: {
							mempoolTransactionCount: true,
						},
					})
				}
			>
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
								sources: selection.sources,
								fields: {
									timestampMs: true,
								},
							})
						}
					>
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
								sources: selection.sources,
								fields: {
									source: true,
								},
							})
						}
					>
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
						selection={select(EntityType.UtxoAddress, selection.entitySelector.$address)}
						href={
							(
								selection.entitySelector.$address != null && 'address' in selection.entitySelector.$address
								&& selection.entitySelector.$address.address != null
								&& selection.entitySelector.$address != null && '$network' in selection.entitySelector.$address ?
									selection.entitySelector.$address.$network != null && 'caip2' in selection.entitySelector.$address.$network
									&& selection.entitySelector.$address.$network.caip2 != null ?
										resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
									address: String(selection.entitySelector.$address.address ?? ''),
									network: String(caip2StringFromValue(selection.entitySelector.$address.$network.caip2) ?? ''),
								})
								:
										selection.entitySelector.$address.$network != null && 'slug' in selection.entitySelector.$address.$network
										&& selection.entitySelector.$address.$network.slug != null ?
											resolve('/network/[network=networkCaip2OrNetworkSlug]/address/[address=stringSegment]', {
										address: String(selection.entitySelector.$address.address ?? ''),
										network: String(selection.entitySelector.$address.$network.slug ?? ''),
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
		</dl>
	{/snippet}
</EntityView>
