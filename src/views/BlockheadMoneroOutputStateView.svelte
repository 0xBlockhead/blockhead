<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyData, EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import EntityView, { EntityLayout } from '$/components/EntityView.svelte'
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadMoneroOutputState>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.BlockheadMoneroOutputState>>
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
	const blockheadMoneroOutputState = $derived(selection({
		sources: [
			Source.Local_Internal,
		],
		fields: {
			$network: true,
			amountAtomicUnits: true,
		},
	}))
	const titleFallback = $derived([String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || 'blockhead monero output state')
	const viewDomId = $derived('blockhead-monero-output-state-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadMoneroOutputState_TimestampsView from '$/views/BlockheadMoneroOutputState_TimestampsView.svelte'
	import BlockheadWalletView from '$/views/BlockheadWalletView.svelte'
	import MoneroNetworkView from '$/views/MoneroNetworkView.svelte'
	import MoneroStealthOutputView from '$/views/MoneroStealthOutputView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadMoneroOutputState}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={blockheadMoneroOutputState}>
			{#snippet Pending()}
				{[String((pendingEntity.txHash) ?? '')].filter(Boolean).join(' ') || title || 'blockhead monero output state'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txHash) ?? '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadMoneroOutputState}>
			{#snippet Pending()}
				{@const outputIndex0 = pendingEntity.outputIndex}
				{#if outputIndex0 !== undefined && outputIndex0 !== null}
					<NumberValue value={Number(outputIndex0)} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const outputIndex0 = resolvedEntity.outputIndex}
				{#if outputIndex0 !== undefined && outputIndex0 !== null}
					<NumberValue value={Number(outputIndex0)} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={blockheadMoneroOutputState}>
			{#snippet Pending()}
				{@const amountAtomicUnits0 = pendingEntity.amountAtomicUnits}
				{#if amountAtomicUnits0 !== undefined && amountAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountAtomicUnits0)} />
					</span>
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const amountAtomicUnits0 = resolvedEntity.amountAtomicUnits}
				{#if amountAtomicUnits0 !== undefined && amountAtomicUnits0 !== null}
					<span data-text="muted">
						<NumberValue value={Number(amountAtomicUnits0)} />
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>wallet ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									walletId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const walletId = pendingEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const walletId = resolvedEntity.walletId}
							{#if walletId !== undefined && walletId !== null}
								{String((walletId) ?? '')}
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$wallet}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(blockheadWallet)}
					{#if blockheadWallet != null && blockheadWallet[EntityMetaKey.Selector] != null}
						<div>
							<dt>wallet</dt>
							<dd>
								<BlockheadWalletView
									selection={select(EntityType.BlockheadWallet, blockheadWallet[EntityMetaKey.Selector])}
									prefetched={blockheadWallet}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(moneroNetwork)}
							{#if moneroNetwork != null && moneroNetwork[EntityMetaKey.Selector] != null}
								<MoneroNetworkView
									selection={select(EntityType.MoneroNetwork, moneroNetwork[EntityMetaKey.Selector])}
									prefetched={moneroNetwork}
									layout={EntityLayout.Value}
									open={false}
								/>
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$stealthOutput}
			>
				{#snippet Pending()}{/snippet}

				{#snippet children(moneroStealthOutput)}
					{#if moneroStealthOutput != null && moneroStealthOutput[EntityMetaKey.Selector] != null}
						<div>
							<dt>stealth output</dt>
							<dd>
								<MoneroStealthOutputView
									selection={select(EntityType.MoneroStealthOutput, moneroStealthOutput[EntityMetaKey.Selector])}
									prefetched={moneroStealthOutput}
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
			<div>
				<dt>Transaction hash</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txHash: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txHash = pendingEntity.txHash}
							{#if txHash !== undefined && txHash !== null}
								<TruncatedValue value={String((txHash) ?? '')} />
							{/if}
						{/snippet}

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

			<div>
				<dt>output index</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									outputIndex: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const outputIndex = pendingEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								<NumberValue value={Number(outputIndex)} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const outputIndex = resolvedEntity.outputIndex}
							{#if outputIndex !== undefined && outputIndex !== null}
								<NumberValue value={Number(outputIndex)} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							accountIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const accountIndex = pendingEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const accountIndex = resolvedEntity.accountIndex}
					{#if accountIndex !== undefined && accountIndex !== null}
						<div>
							<dt>account index</dt>
							<dd>
								<NumberValue value={Number(accountIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							addressIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const addressIndex = pendingEntity.addressIndex}
					{#if addressIndex !== undefined && addressIndex !== null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue value={Number(addressIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const addressIndex = resolvedEntity.addressIndex}
					{#if addressIndex !== undefined && addressIndex !== null}
						<div>
							<dt>address index</dt>
							<dd>
								<NumberValue value={Number(addressIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							amountAtomicUnits: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const amountAtomicUnits = pendingEntity.amountAtomicUnits}
					{#if amountAtomicUnits !== undefined && amountAtomicUnits !== null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue value={Number(amountAtomicUnits)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const amountAtomicUnits = resolvedEntity.amountAtomicUnits}
					{#if amountAtomicUnits !== undefined && amountAtomicUnits !== null}
						<div>
							<dt>amount atomic units</dt>
							<dd>
								<NumberValue value={Number(amountAtomicUnits)} />
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
							keyImage: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyImage = pendingEntity.keyImage}
					{#if keyImage !== undefined && keyImage !== null}
						<div>
							<dt>key image</dt>
							<dd>
								{String((keyImage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyImage = resolvedEntity.keyImage}
					{#if keyImage !== undefined && keyImage !== null}
						<div>
							<dt>key image</dt>
							<dd>
								{String((keyImage) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							keyImageSignature: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const keyImageSignature = pendingEntity.keyImageSignature}
					{#if keyImageSignature !== undefined && keyImageSignature !== null}
						<div>
							<dt>key image signature</dt>
							<dd>
								<TruncatedValue value={String((keyImageSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const keyImageSignature = resolvedEntity.keyImageSignature}
					{#if keyImageSignature !== undefined && keyImageSignature !== null}
						<div>
							<dt>key image signature</dt>
							<dd>
								<TruncatedValue value={String((keyImageSignature) ?? '')} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							globalOutputIndex: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const globalOutputIndex = pendingEntity.globalOutputIndex}
					{#if globalOutputIndex !== undefined && globalOutputIndex !== null}
						<div>
							<dt>global output index</dt>
							<dd>
								<NumberValue value={Number(globalOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const globalOutputIndex = resolvedEntity.globalOutputIndex}
					{#if globalOutputIndex !== undefined && globalOutputIndex !== null}
						<div>
							<dt>global output index</dt>
							<dd>
								<NumberValue value={Number(globalOutputIndex)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<BlockheadMoneroOutputState_TimestampsView
				selection={
						selection.$$timestamps({
							count: true,
						})
					}
				title='timestamps'
				emptyText='No Monero output observations.'
				id='BlockheadMoneroOutputState_TimestampsView-timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
