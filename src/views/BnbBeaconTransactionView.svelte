<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { RegisteredEntityProxyData, RegisteredEntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
			selection: RegisteredEntityProxyResource<EntityType.BnbBeaconTransaction>
			prefetched?: Partial<RegisteredEntityProxyData<EntityType.BnbBeaconTransaction>>
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
	const bnbBeaconTransaction = $derived(selection({
		sources: selection.sources,
		fields: {
			txType: true,
			tokenSymbol: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'bnb beacon transaction')
	const viewDomId = $derived('bnb-beacon-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BnbBeaconTokenTransfersView from '$/views/BnbBeaconTokenTransfersView.svelte'
	import BnbBeaconNetworkView from '$/views/BnbBeaconNetworkView.svelte'
	import BnbBeaconBlockView from '$/views/BnbBeaconBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.BnbBeaconTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
					{@const txHash0 = pendingEntity.txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String((txHash0) ?? '')} />
					{/if}
		{:else}
			<ResourceBoundary resource={bnbBeaconTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txHash0 = resolvedEntity.txHash}
					{#if txHash0 !== undefined && txHash0 !== null}
						<TruncatedValue value={String((txHash0) ?? '')} />
					{/if}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Value()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			{[String((pendingEntity.txType) ?? ''), String((pendingEntity.tokenSymbol) ?? '')].filter(Boolean).join(' ') || [String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
		{:else}
			<ResourceBoundary resource={bnbBeaconTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{[String((resolvedEntity.txType) ?? ''), String((resolvedEntity.tokenSymbol) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txHash) ?? '')].filter(Boolean).join(' ') || titleFallback}
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet HeadingAfter()}
		{#if prefetched[EntityMetaKey.Selector] != null && layout !== EntityLayout.SummaryDetails}
			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(bnbBeaconBlock)}
					{#if bnbBeaconBlock != null && bnbBeaconBlock[EntityMetaKey.Selector] != null}
						<span data-text="muted">
							<BnbBeaconBlockView
								selection={select(EntityType.BnbBeaconBlock, bnbBeaconBlock[EntityMetaKey.Selector])}
								prefetched={bnbBeaconBlock}
								layout={EntityLayout.Title}
								open={false}
							/>
						</span>
					{:else}
						<span data-text="muted">Unavailable</span>
					{/if}
				{/snippet}
			</ResourceBoundary>
		{:else}
			<ResourceBoundary resource={bnbBeaconTransaction}>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(bnbBeaconBlock)}
							{#if bnbBeaconBlock != null && bnbBeaconBlock[EntityMetaKey.Selector] != null}
								<span data-text="muted">
									<BnbBeaconBlockView
										selection={select(EntityType.BnbBeaconBlock, bnbBeaconBlock[EntityMetaKey.Selector])}
										prefetched={bnbBeaconBlock}
										layout={EntityLayout.Title}
										open={false}
									/>
								</span>
							{:else}
								<span data-text="muted">Unavailable</span>
							{/if}
						{/snippet}
					</ResourceBoundary>
				{/snippet}
			</ResourceBoundary>
		{/if}
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network, {})}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								sources: selection.sources,
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txHash = resolvedEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						sources: selection.sources,
						fields: {
							txType: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const txType = resolvedEntity.txType}
					{#if txType !== undefined && txType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((txType) ?? '')}
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
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceAddress = resolvedEntity.sourceAddress}
					{#if sourceAddress !== undefined && sourceAddress !== null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={String((sourceAddress) ?? '')} />
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
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationAddress = resolvedEntity.destinationAddress}
					{#if destinationAddress !== undefined && destinationAddress !== null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={String((destinationAddress) ?? '')} />
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
							amount: true,
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
							feeAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeAmount = resolvedEntity.feeAmount}
					{#if feeAmount !== undefined && feeAmount !== null}
						<div>
							<dt>fee amount</dt>
							<dd>
								<NumberValue
									value={feeAmount}
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
							tokenSymbol: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const tokenSymbol = resolvedEntity.tokenSymbol}
					{#if tokenSymbol !== undefined && tokenSymbol !== null}
						<div>
							<dt>token symbol</dt>
							<dd>
								{String((tokenSymbol) ?? '')}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const memo = resolvedEntity.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
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
							orderId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const orderId = resolvedEntity.orderId}
					{#if orderId !== undefined && orderId !== null}
						<div>
							<dt>order ID</dt>
							<dd>
								{String((orderId) ?? '')}
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
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sequence = resolvedEntity.sequence}
					{#if sequence !== undefined && sequence !== null}
						<div>
							<dt>sequence</dt>
							<dd>
								<NumberValue
									value={sequence}
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
							code: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const code = resolvedEntity.code}
					{#if code !== undefined && code !== null}
						<div>
							<dt>code</dt>
							<dd>
								<NumberValue
									value={code}
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
							log: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const log = resolvedEntity.log}
					{#if log !== undefined && log !== null}
						<div>
							<dt>log</dt>
							<dd>
								{String((log) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BnbBeaconTokenTransfersView
				selection={
						selection.$$tokenEffects({
							count: true,
						})
					}
				title='token effects'
				emptyText='No token effects found.'
				id='BnbBeaconTokenTransfersView-token-effects'
			/>
		{/if}
	{/snippet}
</EntityView>
