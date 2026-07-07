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
			selection: EntityProxyResource<typeof schema, EntityType.AvalanchePChainTransaction>
			prefetched?: Partial<EntityProxyData<typeof schema, EntityType.AvalanchePChainTransaction>>
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
	const avalanchePChainTransaction = $derived(selection({
		fields: {
			txType: true,
			$block: true,
		},
	}))
	const titleFallback = $derived([String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || 'avalanche p chain transaction')
	const viewDomId = $derived('avalanche-pchain-transaction-' + (titleFallback.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'entity').replace(/^-|-$/g, ''))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import Timestamp from '$/components/Timestamp.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import AvalanchePChainTransaction_TimestampsView from '$/views/AvalanchePChainTransaction_TimestampsView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import AvalanchePChainBlockView from '$/views/AvalanchePChainBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.AvalanchePChainTransaction}
	entitySelector={selection.entitySelector ?? prefetched[EntityMetaKey.Selector]}
	id={viewDomId}
	title={title ?? titleFallback}
	{href}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet Pending()}
				{@const txId0 = selection.entitySelector.txId ?? prefetched.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{@const txId0 = resolvedEntity.txId}
				{#if txId0 !== undefined && txId0 !== null}
					<TruncatedValue value={String((txId0) ?? '')} />
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet Pending()}
				{[String((prefetched.txType) ?? '')].filter(Boolean).join(' ') || [String((selection.entitySelector.txId ?? prefetched.txId) ?? '')].filter(Boolean).join(' ') || title || 'avalanche p chain transaction'}
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				{[String((resolvedEntity.txType) ?? '')].filter(Boolean).join(' ') || [String((resolvedEntity.txId) ?? '')].filter(Boolean).join(' ') || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet Pending()}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AvalanchePChainBlock, false>('$block')}
				>
					{#snippet children(avalanchePChainBlock)}
						{#if avalanchePChainBlock != null && avalanchePChainBlock[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, avalanchePChainBlock[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}

			{#snippet children(entity)}
				{@const resolvedEntity = { ...pendingEntity, ...entity }}
				<ResourceBoundary
					resource={selection[EntityProxyField]<EntityType.AvalanchePChainBlock, false>('$block')}
				>
					{#snippet children(avalanchePChainBlock)}
						{#if avalanchePChainBlock != null && avalanchePChainBlock[EntityMetaKey.Selector] != null}
							<span data-text="muted">
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, avalanchePChainBlock[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock}
									layout={EntityLayout.Title}
									open={false}
								/>
							</span>
						{/if}
					{/snippet}
				</ResourceBoundary>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
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

			<div>
				<dt>transaction ID</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									txId: true,
								},
							})
						}
					>
						{#snippet Pending()}
							{@const txId = selection.entitySelector.txId ?? prefetched.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}

						{#snippet children(entity)}
							{@const resolvedEntity = { ...pendingEntity, ...entity }}
							{@const txId = resolvedEntity.txId}
							{#if txId !== undefined && txId !== null}
								<TruncatedValue value={String((txId) ?? '')} />
							{/if}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							txType: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const txType = prefetched.txType}
					{#if txType !== undefined && txType !== null}
						<div>
							<dt>transaction type</dt>
							<dd>
								{String((txType) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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

			<ResourceBoundary
				resource={selection[EntityProxyField]<EntityType.AvalanchePChainBlock, false>('$block')}
			>
				{#snippet children(avalanchePChainBlock)}
					{#if avalanchePChainBlock != null && avalanchePChainBlock[EntityMetaKey.Selector] != null}
						<div>
							<dt>block</dt>
							<dd>
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, avalanchePChainBlock[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock}
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
							subnetId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const subnetId = prefetched.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const subnetId = resolvedEntity.subnetId}
					{#if subnetId !== undefined && subnetId !== null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{String((subnetId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blockchainId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const blockchainId = prefetched.blockchainId}
					{#if blockchainId !== undefined && blockchainId !== null}
						<div>
							<dt>blockchain ID</dt>
							<dd>
								{String((blockchainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const blockchainId = resolvedEntity.blockchainId}
					{#if blockchainId !== undefined && blockchainId !== null}
						<div>
							<dt>blockchain ID</dt>
							<dd>
								{String((blockchainId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							nodeId: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const nodeId = prefetched.nodeId}
					{#if nodeId !== undefined && nodeId !== null}
						<div>
							<dt>node ID</dt>
							<dd>
								{String((nodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const nodeId = resolvedEntity.nodeId}
					{#if nodeId !== undefined && nodeId !== null}
						<div>
							<dt>node ID</dt>
							<dd>
								{String((nodeId) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							startTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const startTimeMs = prefetched.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const startTimeMs = resolvedEntity.startTimeMs}
					{#if startTimeMs !== undefined && startTimeMs !== null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={Number(startTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							endTimeMs: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const endTimeMs = prefetched.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const endTimeMs = resolvedEntity.endTimeMs}
					{#if endTimeMs !== undefined && endTimeMs !== null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={Number(endTimeMs)} />
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
							stakeAmountNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const stakeAmountNavax = prefetched.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const stakeAmountNavax = resolvedEntity.stakeAmountNavax}
					{#if stakeAmountNavax !== undefined && stakeAmountNavax !== null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue value={Number(stakeAmountNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							feeNavax: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const feeNavax = prefetched.feeNavax}
					{#if feeNavax !== undefined && feeNavax !== null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue value={Number(feeNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const feeNavax = resolvedEntity.feeNavax}
					{#if feeNavax !== undefined && feeNavax !== null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue value={Number(feeNavax)} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							memo: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const memo = prefetched.memo}
					{#if memo !== undefined && memo !== null}
						<div>
							<dt>memo</dt>
							<dd>
								{String((memo) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

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
						fields: {
							sourceChain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const sourceChain = prefetched.sourceChain}
					{#if sourceChain !== undefined && sourceChain !== null}
						<div>
							<dt>source chain</dt>
							<dd>
								{String((sourceChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const sourceChain = resolvedEntity.sourceChain}
					{#if sourceChain !== undefined && sourceChain !== null}
						<div>
							<dt>source chain</dt>
							<dd>
								{String((sourceChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							destinationChain: true,
						},
					})
				}
			>
				{#snippet Pending()}
					{@const destinationChain = prefetched.destinationChain}
					{#if destinationChain !== undefined && destinationChain !== null}
						<div>
							<dt>destination chain</dt>
							<dd>
								{String((destinationChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}

				{#snippet children(entity)}
					{@const resolvedEntity = { ...pendingEntity, ...entity }}
					{@const destinationChain = resolvedEntity.destinationChain}
					{#if destinationChain !== undefined && destinationChain !== null}
						<div>
							<dt>destination chain</dt>
							<dd>
								{String((destinationChain) ?? '')}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{#if detailsOpen}
			<AvalanchePChainTransaction_TimestampsView
				selection={selection[EntityProxyField]<EntityType.AvalanchePChainTransaction_Timestamp>('$$timestamps')}
				title='timestamps'
				emptyText='No observations yet.'
				id='AvalanchePChainTransaction_TimestampsView-$$timestamps'
			/>
		{/if}
	{/snippet}
</EntityView>
