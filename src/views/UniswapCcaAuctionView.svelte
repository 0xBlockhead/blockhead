<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { untrack } from 'svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		selection,
		title,
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: Omit<EntitySelectionViewProps<EntityType.UniswapCcaAuction>, 'prefetched'> = $props()

	const uniswapCcaAuction = $derived(selection({
		sources: selection.sources ?? [
			Source.UniswapContracts_Evm,
		],
		fields: {
			totalSupply: true,
			floorPriceQ96: true,
			tickSpacingQ96: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import UniswapCcaAuction_EvmBlocksView from '$/views/UniswapCcaAuction_EvmBlocksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<EntityView
	entityType={EntityType.UniswapCcaAuction}
	entitySelector={selection.entitySelector}
	title={title ?? (selection.entitySelector.auctionAddress || 'Uniswap CCA auction')}
	href={
		href === undefined ?
			(
				'caip2' in selection.entitySelector.$network ?
					resolve(
						'/(assets)/uniswap-cca/auction/[chainId=eip155ChainId]/[auctionAddress=evmAddress]',
						{
							chainId: selection.entitySelector.$network.caip2.reference,
							auctionAddress: selection.entitySelector.auctionAddress,
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
		<TruncatedValue value={selection.entitySelector.auctionAddress} />
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary
			resource={selection.$token}
		>
			{#snippet children(evmCoinInstance)}
				{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
				<EvmCoinInstanceView
					selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
					href={null}
					layout={EntityLayout.Value}
				/>
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

	{#snippet Content()}
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

			<div>
				<dt>Auction address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.auctionAddress} />
				</dd>
			</div>

			<div>
				<dt>Auction contract</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$auctionContract}
					>
						{#snippet children(evmContract)}
							{@const evmContractInitial = untrack(() => evmContract)}
							<EvmContractView
								selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
								prefetched={evmContract ?? evmContractInitial}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Currency</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$currency}
					>
						{#snippet children(evmCoinInstance)}
							{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Auction token</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$token}
					>
						{#snippet children(evmCoinInstance)}
							{@const evmCoinInstanceInitial = untrack(() => evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, (evmCoinInstance ?? evmCoinInstanceInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Total supply</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapCcaAuction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.totalSupply}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Tokens recipient</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$tokensRecipient}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Funds recipient</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$fundsRecipient}
					>
						{#snippet children(evmAccount)}
							{@const evmAccountInitial = untrack(() => evmAccount)}
							<EvmAccountView
								selection={select(EntityType.EvmAccount, (evmAccount ?? evmAccountInitial)[EntityMetaKey.Selector])}
								layout={EntityLayout.Value}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$validationHook}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						{@const evmContractInitial = untrack(() => evmContract)}
						<div>
							<dt>Validation hook</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, (evmContract ?? evmContractInitial)[EntityMetaKey.Selector])}
									prefetched={evmContract ?? evmContractInitial}
									layout={EntityLayout.Value}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Start block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$startBlock}
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
				<dt>End block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$endBlock}
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
				<dt>Claim block</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$claimBlock}
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
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Floor price Q96</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapCcaAuction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.floorPriceQ96}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Tick spacing Q96</dt>
				<dd>
					<ResourceBoundary
						resource={uniswapCcaAuction}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.tickSpacingQ96}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details()}
		{@const blocksResource = selection
			.$$blocks({
				sources: [
					Source.UniswapContracts_Evm,
				],
			})}
		<ResourceBoundary
			resource={blocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<UniswapCcaAuction_EvmBlocksView
						selection={blocksResource}
						countResource={blocksResource.count}
						title='Clearing state'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
