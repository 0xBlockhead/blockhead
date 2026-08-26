<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'


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
	}: Omit<EntitySelectionViewProps<EntityType.UniswapCcaAuction_EvmBlock>, 'prefetched'> = $props()

	const auction = $derived(selection.entitySelector.$auction)
	const uniswapCcaAuctionEvmBlock = $derived(selection({
		fields: {
			schedulePhase: true,
			isGraduated: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import UniswapCcaAuctionView from '$/views/UniswapCcaAuctionView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapCcaAuction_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? String(selection.entitySelector.blockNumber)}
	href={
		href === undefined ?
			(
				'caip2' in auction.$network ?
					resolve(
						'/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]/(uniswapCcaAuction)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: auction.$network.caip2.reference,
							auctionAddress: auction.auctionAddress,
							blockNumber: String(selection.entitySelector.blockNumber),
						}
					)
				:
					undefined
			)
		:
			href ?? undefined
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<NumberValue
			value={selection.entitySelector.blockNumber}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={uniswapCcaAuctionEvmBlock}>
			{#snippet children(entity)}
				{[entity.schedulePhase, String(entity.isGraduated)].filter(Boolean).join(' ') || String(selection.entitySelector.blockNumber)}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<UniswapCcaAuctionView
				selection={select(EntityType.UniswapCcaAuction, selection.entitySelector.$auction)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Auction</dt>
				<dd>
					<UniswapCcaAuctionView
						selection={select(EntityType.UniswapCcaAuction, selection.entitySelector.$auction)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$block}
					>
						{#snippet children(evmBlock)}
							{@const evmBlockInitial = untrack(() => evmBlock)}
							<EvmBlockView
								selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
								prefetched={evmBlock ?? evmBlockInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Schedule phase</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapCcaAuctionEvmBlock}
					>
						{#snippet children(entity)}
							{entity.schedulePhase}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Graduated</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapCcaAuctionEvmBlock}
					>
						{#snippet children(entity)}
							{entity.isGraduated ? 'Yes' : 'No'}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Clearing price Q96</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									clearingPriceQ96: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.clearingPriceQ96}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Currency raised at clearing price Q96X7</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currencyRaisedAtClearingPriceQ96X7: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.currencyRaisedAtClearingPriceQ96X7}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Cumulative MPS per price</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cumulativeMpsPerPrice: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.cumulativeMpsPerPrice}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Cumulative MPS</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									cumulativeMps: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.cumulativeMps}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Currency raised</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									currencyRaised: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.currencyRaised}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total cleared</dt>
				<dd>
					<ResourceBoundary
						resource={
							selection({
								fields: {
									totalCleared: true,
								},
							})
						}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.totalCleared}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$previousCheckpoint}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Previous checkpoint</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$nextCheckpoint}
			>
				{#snippet children(evmBlock)}
					{#if evmBlock != null}
						{@const evmBlockInitial = untrack(() => evmBlock)}
						<div>
							<dt>Next checkpoint</dt>
							<dd>
								<EvmBlockView
									selection={select(EntityType.EvmBlock, (evmBlock ?? evmBlockInitial)[EntityMetaKey.Selector])}
									prefetched={evmBlock ?? evmBlockInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
