<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		prefetched = {},
		title,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.BnbBeaconTransaction> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const bnbBeaconTransaction = $derived(selection({
		fields: {
			txType: true,
			tokenSymbol: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.txHash ?? '') || 'bnb beacon transaction')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={pendingEntity.txHash} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={bnbBeaconTransaction}>
			{#snippet children(entity)}
				{[(entity.txType ?? ''), (entity.tokenSymbol ?? '')].filter(Boolean).join(' ') || pendingEntity.txHash || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(bnbBeaconBlock)}
				{#if bnbBeaconBlock != null}
					<span data-text="muted">
						<BnbBeaconBlockView
							selection={select(EntityType.BnbBeaconBlock, bnbBeaconBlock[EntityMetaKey.Selector])}
							prefetched={bnbBeaconBlock}
							layout={EntityLayout.Title}
							open={false}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<BnbBeaconNetworkView
						selection={select(EntityType.BnbBeaconNetwork, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Transaction hash</dt>
				<dd>
					<TruncatedValue value={pendingEntity.txHash} />
				</dd>
			</div>

			<ResourceBoundary
				resource={bnbBeaconTransaction}
			>
				{#snippet children(entity)}
					{@const txType = entity.txType}
					{#if txType != null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{txType}
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
							sourceAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceAddress = entity.sourceAddress}
					{#if sourceAddress != null}
						<div>
							<dt>source address</dt>
							<dd>
								<TruncatedValue value={sourceAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const destinationAddress = entity.destinationAddress}
					{#if destinationAddress != null}
						<div>
							<dt>destination address</dt>
							<dd>
								<TruncatedValue value={destinationAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const amount = entity.amount}
					{#if amount != null}
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
						fields: {
							feeAmount: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeAmount = entity.feeAmount}
					{#if feeAmount != null}
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
				resource={bnbBeaconTransaction}
			>
				{#snippet children(entity)}
					{@const tokenSymbol = entity.tokenSymbol}
					{#if tokenSymbol != null}
						<div>
							<dt>token symbol</dt>
							<dd>
								{tokenSymbol}
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
							memo: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const memo = entity.memo}
					{#if memo != null}
						<div>
							<dt>memo</dt>
							<dd>
								{memo}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							orderId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const orderId = entity.orderId}
					{#if orderId != null}
						<div>
							<dt>order ID</dt>
							<dd>
								{orderId}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							sequence: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sequence = entity.sequence}
					{#if sequence != null}
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
						fields: {
							code: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const code = entity.code}
					{#if code != null}
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
						fields: {
							log: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const log = entity.log}
					{#if log != null}
						<div>
							<dt>log</dt>
							<dd>
								{log}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const bnbBeaconTransactionBnbBeaconTokenTransfersViewTokenEffectsResource = selection.$$tokenEffects}
		<ResourceBoundary
			resource={bnbBeaconTransactionBnbBeaconTokenTransfersViewTokenEffectsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<BnbBeaconTokenTransfersView
						selection={bnbBeaconTransactionBnbBeaconTokenTransfersViewTokenEffectsResource}
						countResource={bnbBeaconTransactionBnbBeaconTokenTransfersViewTokenEffectsResource.count}
						title='token effects'
						id='token-effects'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
