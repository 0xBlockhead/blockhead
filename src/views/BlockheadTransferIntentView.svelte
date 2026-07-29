<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	}: EntitySelectionViewProps<EntityType.BlockheadTransferIntent> = $props()

	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Local_Internal,
		],
	}))
	const blockheadTransferIntent = $derived(viewSelection({
		fields: {
			amount: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import BlockheadSessionActionView from '$/views/BlockheadSessionActionView.svelte'
	import AccountView from '$/views/AccountView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.BlockheadTransferIntent}
	entitySelector={selection.entitySelector}
	title={title ?? 'blockhead transfer intent'}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary
			resource={selection.$sessionAction}
		>
			{#snippet children(blockheadSessionAction)}
				<BlockheadSessionActionView
					selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
					prefetched={blockheadSessionAction}
					layout={EntityLayout.Title}
					open={false}
				/>
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={blockheadTransferIntent}>
			{#snippet children(entity)}
				{@const amount = entity.amount}
				{#if amount != null}
					<NumberValue
						value={amount}
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<ResourceBoundary
			resource={selection.$network}
		>
			{#snippet children(network)}
				{#if network != null}
					<span data-text="muted">
						<NetworkView
							selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
							prefetched={network}
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
				<dt>session action</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$sessionAction}
					>
						{#snippet children(blockheadSessionAction)}
							<BlockheadSessionActionView
								selection={select(EntityType.BlockheadSessionAction, blockheadSessionAction[EntityMetaKey.Selector])}
								prefetched={blockheadSessionAction}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromCaip10: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromCaip10 = entity.fromCaip10}
					{#if fromCaip10 != null}
						<div>
							<dt>from CAIP-10</dt>
							<dd>
								<TruncatedValue value={`${fromCaip10.namespace}:${fromCaip10.reference}:${fromCaip10.accountAddress}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toCaip10: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toCaip10 = entity.toCaip10}
					{#if toCaip10 != null}
						<div>
							<dt>to CAIP-10</dt>
							<dd>
								<TruncatedValue value={`${toCaip10.namespace}:${toCaip10.reference}:${toCaip10.accountAddress}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							networkCaip2: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const networkCaip2 = entity.networkCaip2}
					{#if networkCaip2 != null}
						<div>
							<dt>network CAIP-2</dt>
							<dd>
								<TruncatedValue value={`${networkCaip2.namespace}:${networkCaip2.reference}`} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							assetCaip19: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const assetCaip19 = entity.assetCaip19}
					{#if assetCaip19 != null}
						<div>
							<dt>asset CAIP-19</dt>
							<dd>
								{assetCaip19}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							fromAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const fromAddress = entity.fromAddress}
					{#if fromAddress != null}
						<div>
							<dt>from address</dt>
							<dd>
								<TruncatedValue value={fromAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							toAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const toAddress = entity.toAddress}
					{#if toAddress != null}
						<div>
							<dt>to address</dt>
							<dd>
								<TruncatedValue value={toAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							chainId: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const chainId = entity.chainId}
					{#if chainId != null}
						<div>
							<dt>Chain ID</dt>
							<dd>
								<NumberValue
									value={chainId}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={
					viewSelection({
						fields: {
							tokenAddress: true,
						},
					})
				}
			>
				{#snippet children(entity)}
					{@const tokenAddress = entity.tokenAddress}
					{#if tokenAddress != null}
						<div>
							<dt>token address</dt>
							<dd>
								<TruncatedValue value={tokenAddress} />
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>

		<dl data-column-item="center">
			<ResourceBoundary
				resource={selection.$fromAccount}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>from account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									prefetched={account}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$toAccount}
			>
				{#snippet children(account)}
					{#if account != null}
						<div>
							<dt>to account</dt>
							<dd>
								<AccountView
									selection={select(EntityType.Account, account[EntityMetaKey.Selector])}
									prefetched={account}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$from}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>from</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$to}
			>
				{#snippet children(evmAccount)}
					{#if evmAccount != null}
						<div>
							<dt>to</dt>
							<dd>
								<EvmAccountView
									selection={select(EntityType.EvmAccount, evmAccount[EntityMetaKey.Selector])}
									prefetched={evmAccount}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$network}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$evmNetwork}
			>
				{#snippet children(network)}
					{#if network != null}
						<div>
							<dt>EVM network</dt>
							<dd>
								<NetworkView
									selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
									prefetched={network}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<ResourceBoundary
				resource={selection.$token}
			>
				{#snippet children(evmCoinInstance)}
					{#if evmCoinInstance != null}
						<div>
							<dt>token</dt>
							<dd>
								<EvmCoinInstanceView
									selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
									prefetched={evmCoinInstance}
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
				resource={blockheadTransferIntent}
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
		</dl>
	{/snippet}
</EntityView>
