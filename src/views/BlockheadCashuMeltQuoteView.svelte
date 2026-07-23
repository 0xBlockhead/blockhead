<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyPrefetchedData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'


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
			selection: RegisteredEntityProxyResource<EntityType.BlockheadCashuMeltQuote>
			prefetched?: RegisteredEntityProxyPrefetchedData<EntityType.BlockheadCashuMeltQuote>
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
	const blockheadCashuMeltQuote = $derived(selection(prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails ? {
		sources: selection.sources,
		fields: {
			amount: true,
		},
	} : {
		sources: selection.sources,
		fields: {
			amount: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.quoteId) ?? '')].filter(Boolean).join(' ') || 'blockhead Cashu melt quote')
	const viewDomId = $derived('blockhead-cashu-melt-quote-' + encodeURIComponent(stringify(selection.entitySelector ?? prefetched[EntityMetaKey.Selector])))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import BlockheadCashuProofsView from '$/views/BlockheadCashuProofsView.svelte'
	import BlockheadCashuMeltQuote_TimestampsView from '$/views/BlockheadCashuMeltQuote_TimestampsView.svelte'
	import CashuMintView from '$/views/CashuMintView.svelte'
	import BlockheadCashuWalletStateView from '$/views/BlockheadCashuWalletStateView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadCashuMeltQuote}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amount')}
			{[String((pendingEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
		{:else}
			<ResourceBoundary resource={blockheadCashuMeltQuote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.quoteId) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if layout !== EntityLayout.SummaryDetails && Object.hasOwn(prefetched, 'amount')}
			{@const amount0 = pendingEntity.amount}
			{#if amount0 !== undefined && amount0 !== null}
				<NumberValue
					value={amount0}
				/>
			{/if}
		{:else}
			<ResourceBoundary resource={blockheadCashuMeltQuote}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount0 = resolvedEntity.amount}
					{#if amount0 !== undefined && amount0 !== null}
						<NumberValue
							value={amount0}
						/>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>mint</dt>
				<dd>
					<CashuMintView
						selection={select(EntityType.CashuMint, selection.entitySelector.$mint)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>method</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									method: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const method = resolvedEntity.method}
							{#if method !== undefined && method !== null}
								{String((method) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>quote ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									quoteId: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const quoteId = resolvedEntity.quoteId}
							{#if quoteId !== undefined && quoteId !== null}
								{String((quoteId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>request</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									request: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const request = resolvedEntity.request}
							{#if request !== undefined && request !== null}
								{String((request) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$walletState}
			>
				{#snippet children(blockheadCashuWalletState)}
					{#if blockheadCashuWalletState != null && blockheadCashuWalletState[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet state</dt>
							<dd>
								<BlockheadCashuWalletStateView
									selection={select(EntityType.BlockheadCashuWalletState, blockheadCashuWalletState[EntityMetaKey.Selector])}
									prefetched={blockheadCashuWalletState}
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
							amount: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amount = resolvedEntity.amount}
					{#if amount !== undefined && amount !== null}
						<div>
							<dt>amount</dt>
							<dd>
								<NumberValue
									value={amount}
								/>

								<span>{({ value: amount, ...resolvedEntity }).unit == null ? '' : ` ${String(({ value: amount, ...resolvedEntity }).unit)}`}</span>
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
							feeReserve: true,
							unit: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeReserve = resolvedEntity.feeReserve}
					{#if feeReserve !== undefined && feeReserve !== null}
						<div>
							<dt>fee reserve</dt>
							<dd>
								<NumberValue
									value={feeReserve}
								/>

								<span>{({ value: feeReserve, ...resolvedEntity }).unit == null ? '' : ` ${String(({ value: feeReserve, ...resolvedEntity }).unit)}`}</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource = selection.$$inputProofs}
		<ResourceBoundary
			resource={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadCashuProofsView
					selection={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource}
					countResource={blockheadCashuMeltQuoteBlockheadCashuProofsViewInputProofsResource.count}
					title='input proofs'
					id='BlockheadCashuProofsView-input-proofs'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
				<BlockheadCashuMeltQuote_TimestampsView
					selection={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource}
					countResource={blockheadCashuMeltQuoteBlockheadCashuMeltQuoteTimestampsViewTimestampsResource.count}
					title='timestamps'
					id='BlockheadCashuMeltQuote_TimestampsView-timestamps'
				/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
