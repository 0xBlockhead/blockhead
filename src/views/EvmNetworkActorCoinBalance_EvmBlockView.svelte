<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import EntityView, { EntityLayout, type EntitySelectionViewProps } from '$/components/EntityView.svelte'
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
	}: Omit<EntitySelectionViewProps<EntityType.EvmNetworkActorCoinBalance_EvmBlock>, 'prefetched'> = $props()

	const actorCoin = $derived(selection.entitySelector.$actorCoin)
	const evmNetworkActorCoinBalanceEvmBlock = $derived(selection({
		fields: {
			balance: true,
			$actorCoin: {
				fields: {
					decimals: true,
					symbol: true,
				},
			},
			usdValue: true,
		},
	}))


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance_EvmBlock}
	entitySelector={selection.entitySelector}
	title={title ?? 'EVM network actor coin balance EVM block'}
	href={
		href === undefined ?
			(
				'blockNumber' in selection.entitySelector.$block
				&& '$network' in actorCoin
				&& 'caip2' in actorCoin.$network ?
					resolve(
						'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/native/(evmNetworkActorCoinBalance)/block/[blockNumber=nonNegativeBigInt]',
						{
							chainId: actorCoin.$network.caip2.reference,
							owner: actorCoin.$actor.address,
							blockNumber: String(selection.entitySelector.$block.blockNumber),
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
		<EvmBlockView
			selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
			href={null}
			layout={EntityLayout.Title}
		/>
	{/snippet}

	{#snippet Value()}
		<ResourceBoundary resource={evmNetworkActorCoinBalanceEvmBlock}>
			{#snippet children(entity)}
				<NumberValue
					value={entity.balance}
					decimalPlaces={selection.entitySelector.$actorCoin.decimals}
				/>

				<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
				{@const usdValue = entity.usdValue}
				{#if usdValue != null}
					{usdValue}
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmNetworkActorCoinBalanceView
				selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
				layout={EntityLayout.Title}
			/>
		</span>
	{/snippet}

	{#snippet Content()}
		<dl data-column-item="center">
			<div>
				<dt>Block</dt>
				<dd>
					<EvmBlockView
						selection={select(EntityType.EvmBlock, selection.entitySelector.$block)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Actor coin</dt>
				<dd>
					<EvmNetworkActorCoinBalanceView
						selection={select(EntityType.EvmNetworkActorCoinBalance, selection.entitySelector.$actorCoin)}
						layout={EntityLayout.Value}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkActorCoinBalanceEvmBlock}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.balance}
								decimalPlaces={selection.entitySelector.$actorCoin.decimals}
							/>

							<span>{selection.entitySelector.$actorCoin.symbol == null ? '' : ` ${selection.entitySelector.$actorCoin.symbol}`}</span>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={evmNetworkActorCoinBalanceEvmBlock}
			>
				{#snippet children(entity)}
					{@const usdValue = entity.usdValue}
					{#if usdValue != null}
						<div>
							<dt>USD value</dt>
							<dd>
								{usdValue}
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>
		</dl>
	{/snippet}
</EntityView>
