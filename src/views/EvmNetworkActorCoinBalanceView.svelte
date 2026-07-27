<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmNetworkActorCoinBalance> = $props()

	const pendingEntity = $derived({ ...selection.entitySelector, ...prefetched })
	const viewSelection = $derived(selection({
		sources: selection.sources ?? [
			Source.Constants_Internal,
		],
	}))
	const evmNetworkActorCoinBalance = $derived(viewSelection({
		fields: {
			symbol: true,
			decimals: true,
		},
	}))
	const titleFallback = $derived((pendingEntity.symbol ?? '') || 'balance')


	// Components
	import NumberValue from '$/components/NumberValue.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import EvmNetworkActorCoinBalance_TimestampsView from '$/views/EvmNetworkActorCoinBalance_TimestampsView.svelte'
	import EvmNetworkActorCoinBalance_EvmBlocksView from '$/views/EvmNetworkActorCoinBalance_EvmBlocksView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmCoinInstanceView from '$/views/EvmCoinInstanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmNetworkActorCoinBalance}
	entitySelector={selection.entitySelector}
	title={title ?? titleFallback}
	href={
		href ?? (
			'$contract' in selection.entitySelector
			&& 'caip2' in selection.entitySelector.$contract.$network ?
				resolve(
					'/~/accounts/balance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]',
					{
						chainId: String(selection.entitySelector.$contract.$network.caip2.reference),
						owner: String(selection.entitySelector.$actor.address),
						coin: String(selection.entitySelector.$contract.address),
					}
				)
			:
				undefined
		)
	}
	{layout}
	bind:open
	{...EntityViewProps}
>
	{#snippet Title()}
		<ResourceBoundary resource={evmNetworkActorCoinBalance}>
			{#snippet children(entity)}
				{entity.symbol || title || titleFallback}
			{/snippet}
		</ResourceBoundary>
	{/snippet}

	{#snippet Value()}
		<EvmAccountView
			selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
			href=""
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet HeadingAfter()}
		<span data-text="muted">
			<EvmAccountView
				selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
				layout={EntityLayout.Title}
				open={false}
			/>
		</span>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Actor</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Network</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$network}
					>
						{#snippet children(network)}
							<NetworkView
								selection={select(EntityType.Network, network[EntityMetaKey.Selector])}
								prefetched={network}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$contract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Contract</dt>
							<dd>
								<EvmContractView
									selection={select(EntityType.EvmContract, evmContract[EntityMetaKey.Selector])}
									prefetched={evmContract}
									layout={EntityLayout.Value}
									open={false}
								/>
							</dd>
						</div>
					{/if}
				{/snippet}
			</ResourceBoundary>

			<div>
				<dt>Coin</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$coinInstance}
					>
						{#snippet children(evmCoinInstance)}
							<EvmCoinInstanceView
								selection={select(EntityType.EvmCoinInstance, evmCoinInstance[EntityMetaKey.Selector])}
								prefetched={evmCoinInstance}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Symbol</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkActorCoinBalance}
					>
						{#snippet children(entity)}
							{entity.symbol}
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Decimals</dt>
				<dd>
					<ResourceBoundary
						resource={evmNetworkActorCoinBalance}
					>
						{#snippet children(entity)}
							<NumberValue
								value={entity.decimals}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceTimestampsViewTimestampsResource = selection.$$timestamps}
		<ResourceBoundary
			resource={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceTimestampsViewTimestampsResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNetworkActorCoinBalance_TimestampsView
						selection={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceTimestampsViewTimestampsResource}
						countResource={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceTimestampsViewTimestampsResource.count}
						title='Observations'
						id='timestamps'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
		{@const evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceEvmBlocksViewBlocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceEvmBlocksViewBlocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmNetworkActorCoinBalance_EvmBlocksView
						selection={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceEvmBlocksViewBlocksResource}
						countResource={evmNetworkActorCoinBalanceEvmNetworkActorCoinBalanceEvmBlocksViewBlocksResource.count}
						title='Blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
