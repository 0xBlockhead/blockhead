<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import { resolve } from '$app/paths'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


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
			selection: EntityProxyResource<typeof schema, EntityType.UtxoAddress_Timestamp>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.UtxoAddress_Timestamp>>
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

	const utxoAddressTimestamp = $derived(selection({
		fields: {
			balanceSats: true,
			transactionCount: true,
			fundedOutputCount: true,
			fundedValueSats: true,
			spentOutputCount: true,
			spentValueSats: true,
			unspentOutputCount: true,
			mempoolTransactionCount: true,
		},
	}))
	const titleFallback = $derived([String((({ ...selection.entitySelector, ...prefetched }).timestampMs) ?? '')].filter(Boolean).join(' ') || 'UTXO address timestamp')
	const viewDomId = $derived('utxo-address-timestamp-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))
	// Components
	import EntityView from '$/components/EntityView.svelte'
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import UtxoAddressView from '$/views/UtxoAddressView.svelte'
</script>


<EntityView
	entityType={EntityType.UtxoAddress_Timestamp}
	entitySelector={selection.entitySelector}
	id={viewDomId}
	title={title ?? titleFallback}
	href={
		href ?? resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]/observations/[timestampMs=nonNegativeInteger]/[source]', {
			networkSlug: String(({ ...selection.entitySelector, ...prefetched }).$address.slug),
			address: String(({ ...selection.entitySelector, ...prefetched }).$address.address),
			timestampMs: String(({ ...selection.entitySelector, ...prefetched }).timestampMs),
			source: String(({ ...selection.entitySelector, ...prefetched }).source),
		})
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
			{#if timestampMs0 !== undefined && timestampMs0 !== null}
				<Timestamp timestamp={Number(timestampMs0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const timestampMs0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).timestampMs}
					{#if timestampMs0 !== undefined && timestampMs0 !== null}
						<Timestamp timestamp={Number(timestampMs0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const balanceSats0 = ({ ...selection.entitySelector, ...prefetched }).balanceSats}
			{#if balanceSats0 !== undefined && balanceSats0 !== null}
				<NumberValue value={Number(balanceSats0)} />
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const balanceSats0 = ({ ...selection.entitySelector, ...prefetched }).balanceSats}
					{#if balanceSats0 !== undefined && balanceSats0 !== null}
						<NumberValue value={Number(balanceSats0)} />
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const balanceSats0 = ({ ...selection.entitySelector, ...prefetched, ...entity }).balanceSats}
					{#if balanceSats0 !== undefined && balanceSats0 !== null}
						<NumberValue value={Number(balanceSats0)} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if layout === EntityLayout.Summary || layout === EntityLayout.SummaryInline}
			{@const source0 = prefetched.source}
			{#if source0 !== undefined && source0 !== null}
				<span data-text="muted">
					{String((source0) ?? '')}
				</span>
			{/if}
		{:else}
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const source0 = prefetched.source}
					{#if source0 !== undefined && source0 !== null}
						<span data-text="muted">
							{String((source0) ?? '')}
						</span>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const source0 = entity.source}
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
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const transactionCount = prefetched.transactionCount ?? selection.entitySelector.transactionCount}
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
					{@const transactionCount = entity.transactionCount ?? selection.entitySelector.transactionCount ?? prefetched.transactionCount}
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

			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const fundedOutputCount = prefetched.fundedOutputCount ?? selection.entitySelector.fundedOutputCount}
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
					{@const fundedOutputCount = entity.fundedOutputCount ?? selection.entitySelector.fundedOutputCount ?? prefetched.fundedOutputCount}
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

			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const fundedValueSats = prefetched.fundedValueSats ?? selection.entitySelector.fundedValueSats}
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
					{@const fundedValueSats = entity.fundedValueSats ?? selection.entitySelector.fundedValueSats ?? prefetched.fundedValueSats}
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
			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const spentOutputCount = prefetched.spentOutputCount ?? selection.entitySelector.spentOutputCount}
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
					{@const spentOutputCount = entity.spentOutputCount ?? selection.entitySelector.spentOutputCount ?? prefetched.spentOutputCount}
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

			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const spentValueSats = prefetched.spentValueSats ?? selection.entitySelector.spentValueSats}
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
					{@const spentValueSats = entity.spentValueSats ?? selection.entitySelector.spentValueSats ?? prefetched.spentValueSats}
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

			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const unspentOutputCount = prefetched.unspentOutputCount ?? selection.entitySelector.unspentOutputCount}
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
					{@const unspentOutputCount = entity.unspentOutputCount ?? selection.entitySelector.unspentOutputCount ?? prefetched.unspentOutputCount}
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

			<ResourceBoundary resource={utxoAddressTimestamp}>
				{#snippet Pending()}
					{@const mempoolTransactionCount = prefetched.mempoolTransactionCount ?? selection.entitySelector.mempoolTransactionCount}
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
					{@const mempoolTransactionCount = entity.mempoolTransactionCount ?? selection.entitySelector.mempoolTransactionCount ?? prefetched.mempoolTransactionCount}
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
				<dt>Address</dt>
				<dd>
					<UtxoAddressView
						selection={select(EntityType.UtxoAddress, selection.entitySelector.$address)}
						href={
							resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/address/[address]', {
								networkSlug: String(selection.entitySelector.$address.$network.slug),
								address: String(selection.entitySelector.$address.address),
							})
						}
						layout={EntityLayout.Title}
						open={false}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
