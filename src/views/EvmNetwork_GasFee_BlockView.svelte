<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: EntitySelectionViewProps<EntityType.EvmNetwork_GasFee_Block> = $props()

	const network = $derived(selection.entitySelector.$network)
	const evmNetworkGasFeeBlock = $derived(selection({
		fields: {
			baseFeePerGas: true,
		},
	}))
	const titleFallback = $derived(['Block ' + String(selection.entitySelector.blockNumber), (prefetched.baseFeePerGas != null ? String(prefetched.baseFeePerGas) + ' wei' : '')].filter(Boolean).join(' ') || 'EVM network gas fee block')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetwork_GasFee_Block}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href === undefined ?
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/fee-market/block/[blockNumber=nonNegativeBigInt]',
				{
					network: (
						'caip2' in network ?
							caip2StringFromValue(network.caip2)
						:
							network.slug
					),
					blockNumber: String(selection.entitySelector.blockNumber),
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
		<ResourceBoundary resource={evmNetworkGasFeeBlock}>
			{#snippet children(entity)}
				{['Block ' + String(selection.entitySelector.blockNumber), (entity.baseFeePerGas != null ? String(entity.baseFeePerGas) + ' wei' : '')].filter(Boolean).join(' ') || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkGasFeeBlock}>
			{#snippet children(entity)}
				{@const baseFeePerGas = entity.baseFeePerGas}
				{#if baseFeePerGas != null}
					<NumberValue
						value={baseFeePerGas}
					/>

					<span> wei</span>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<NetworkView
				selection={select(EntityType.Network, selection.entitySelector.$network)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Block number</dt>
				<dd>
					<NumberValue
						value={selection.entitySelector.blockNumber}
					/>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmNetworkGasFeeBlock}
			>
				{#snippet children(entity)}
					{@const baseFeePerGas = entity.baseFeePerGas}
					{#if baseFeePerGas != null}
						<div>
							<dt>Base fee per gas</dt>
							<dd>
								<NumberValue
									value={baseFeePerGas}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							legacyGasPrice: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const legacyGasPrice = entity.legacyGasPrice}
					{#if legacyGasPrice != null}
						<div>
							<dt>Legacy gas price</dt>
							<dd>
								<NumberValue
									value={legacyGasPrice}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							maxPriorityFeePerGas: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const maxPriorityFeePerGas = entity.maxPriorityFeePerGas}
					{#if maxPriorityFeePerGas != null}
						<div>
							<dt>Max priority fee per gas</dt>
							<dd>
								<NumberValue
									value={maxPriorityFeePerGas}
								/>

								<span> wei</span>
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
							gasUsedRatio: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const gasUsedRatio = entity.gasUsedRatio}
					{#if gasUsedRatio != null}
						<div>
							<dt>Gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(gasUsedRatio)}
									options={{ style: 'percent' }}
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
							priorityFeeRewardAt50thPercentile: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const priorityFeeRewardAt50thPercentile = entity.priorityFeeRewardAt50thPercentile}
					{#if priorityFeeRewardAt50thPercentile != null}
						<div>
							<dt>Priority fee reward at 50th percentile</dt>
							<dd>
								<NumberValue
									value={priorityFeeRewardAt50thPercentile}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							baseFeePerBlobGas: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const baseFeePerBlobGas = entity.baseFeePerBlobGas}
					{#if baseFeePerBlobGas != null}
						<div>
							<dt>Base fee per blob gas</dt>
							<dd>
								<NumberValue
									value={baseFeePerBlobGas}
								/>

								<span> wei</span>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					selection({
						fields: {
							blobGasUsedRatio: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const blobGasUsedRatio = entity.blobGasUsedRatio}
					{#if blobGasUsedRatio != null}
						<div>
							<dt>Blob gas used ratio</dt>
							<dd>
								<NumberValue
									value={Number(blobGasUsedRatio)}
									options={{ style: 'percent' }}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Network</dt>
				<dd>
					<NetworkView
						selection={select(EntityType.Network, selection.entitySelector.$network)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>
		</dl>
	{/snippet}
</EntityView>
