<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2StringFromValue } from '$/lib/caip2.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'


	const select = getAppClient().select

	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.AvalanchePChainTransaction>, 'prefetched'> = $props()

	const network = $derived(selection.entitySelector.$network)
	const avalanchePChainTransaction = $derived(selection({
		fields: {
			txType: true,
		},
	}))
	const titleFallback = $derived(selection.entitySelector.txId || 'avalanche p chain transaction')


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
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/avalanche-tx/[txId=stringSegment]',
				{
					network: (
						network.caip2 !== undefined ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					txId: selection.entitySelector.txId,
				}
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<TruncatedValue value={selection.entitySelector.txId} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={avalanchePChainTransaction}>
			{#snippet children(entity)}
				{(entity.txType ?? '') || selection.entitySelector.txId || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$block}
		>
			{#snippet children(avalanchePChainBlock)}
				{#if avalanchePChainBlock != null}
					{@const avalanchePChainBlockInitial = untrack(() => avalanchePChainBlock)}
					<span data-text="muted">
						<AvalanchePChainBlockView
							selection={select(EntityType.AvalanchePChainBlock, (avalanchePChainBlock ?? avalanchePChainBlockInitial)[EntityMetaKey.Selector])}
							prefetched={avalanchePChainBlock ?? avalanchePChainBlockInitial}
							layout={EntityLayout.Title}
						/>
					</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>transaction ID</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.txId} />
				</dd>
			</div>

			<ResourceBoundary
				resource={avalanchePChainTransaction}
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

			<ResourceBoundary
				resource={selection.$block}
			>
				{#snippet children(avalanchePChainBlock)}
					{#if avalanchePChainBlock != null}
						{@const avalanchePChainBlockInitial = untrack(() => avalanchePChainBlock)}
						<div>
							<dt>block</dt>
							<dd>
								<AvalanchePChainBlockView
									selection={select(EntityType.AvalanchePChainBlock, (avalanchePChainBlock ?? avalanchePChainBlockInitial)[EntityMetaKey.Selector])}
									prefetched={avalanchePChainBlock ?? avalanchePChainBlockInitial}
									layout={EntityLayout.Value}
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
				{#snippet children(entity)}
					{@const subnetId = entity.subnetId}
					{#if subnetId != null}
						<div>
							<dt>subnet ID</dt>
							<dd>
								{subnetId}
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
				{#snippet children(entity)}
					{@const blockchainId = entity.blockchainId}
					{#if blockchainId != null}
						<div>
							<dt>blockchain ID</dt>
							<dd>
								{blockchainId}
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
				{#snippet children(entity)}
					{@const nodeId = entity.nodeId}
					{#if nodeId != null}
						<div>
							<dt>node ID</dt>
							<dd>
								{nodeId}
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
				{#snippet children(entity)}
					{@const startTimeMs = entity.startTimeMs}
					{#if startTimeMs != null}
						<div>
							<dt>start time ms</dt>
							<dd>
								<Timestamp timestamp={startTimeMs} />
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
				{#snippet children(entity)}
					{@const endTimeMs = entity.endTimeMs}
					{#if endTimeMs != null}
						<div>
							<dt>end time ms</dt>
							<dd>
								<Timestamp timestamp={endTimeMs} />
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
				{#snippet children(entity)}
					{@const stakeAmountNavax = entity.stakeAmountNavax}
					{#if stakeAmountNavax != null}
						<div>
							<dt>stake amount navax</dt>
							<dd>
								<NumberValue
									value={stakeAmountNavax}
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
							feeNavax: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const feeNavax = entity.feeNavax}
					{#if feeNavax != null}
						<div>
							<dt>fee navax</dt>
							<dd>
								<NumberValue
									value={feeNavax}
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
							sourceChain: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const sourceChain = entity.sourceChain}
					{#if sourceChain != null}
						<div>
							<dt>source chain</dt>
							<dd>
								{sourceChain}
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
				{#snippet children(entity)}
					{@const destinationChain = entity.destinationChain}
					{#if destinationChain != null}
						<div>
							<dt>destination chain</dt>
							<dd>
								{destinationChain}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const timestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={timestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<AvalanchePChainTransaction_TimestampsView
						selection={timestampsResource}
						countResource={timestampsResource.count}
						title='timestamps'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
