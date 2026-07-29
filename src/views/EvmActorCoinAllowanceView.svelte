<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
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
		href,
		layout = EntityLayout.SummaryDetails,
		open = $bindable(layout === EntityLayout.SummaryDetails),
		...EntityViewProps
	}: EntitySelectionViewProps<EntityType.EvmActorCoinAllowance> = $props()

	const contract = $derived(selection.entitySelector.$contract)


	// Components
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import TruncatedValue from '$/components/TruncatedValue.svelte'
	import EvmActorCoinAllowance_BlocksView from '$/views/EvmActorCoinAllowance_BlocksView.svelte'
	import EvmAccountView from '$/views/EvmAccountView.svelte'
	import EvmContractView from '$/views/EvmContractView.svelte'
	import EvmNetworkActorCoinBalanceView from '$/views/EvmNetworkActorCoinBalanceView.svelte'
</script>


<EntityView
	entityType={EntityType.EvmActorCoinAllowance}
	entitySelector={selection.entitySelector}
	title={title ?? 'allowance'}
	href={
		href === undefined ?
			(
				'caip2' in contract.$network ?
					resolve(
						'/~/accounts/allowance/[chainId=eip155ChainId]/[owner=evmAddress]/[coin=evmAddress]/[spender=evmAddress]',
						{
							chainId: contract.$network.caip2.reference,
							owner: selection.entitySelector.$actor.address,
							coin: contract.address,
							spender: selection.entitySelector.$spender.address,
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
		<EvmContractView
			selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
			href={null}
			layout={EntityLayout.Title}
			open={false}
		/>
	{/snippet}

	{#snippet Value()}
		<EvmAccountView
			selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
			href={null}
			layout={EntityLayout.Value}
			open={false}
		/>
	{/snippet}

	{#snippet Content({ open: contentOpen })}
		<dl data-column-item="center">
			<div>
				<dt>Owner</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$actor)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Token</dt>
				<dd>
					<EvmContractView
						selection={select(EntityType.EvmContract, selection.entitySelector.$contract)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>

			<div>
				<dt>Balance</dt>
				<dd>
					<ResourceBoundary
						resource={selection.$actorCoin}
					>
						{#snippet children(evmNetworkActorCoinBalance)}
							<EvmNetworkActorCoinBalanceView
								selection={select(EntityType.EvmNetworkActorCoinBalance, evmNetworkActorCoinBalance[EntityMetaKey.Selector])}
								prefetched={evmNetworkActorCoinBalance}
								layout={EntityLayout.Value}
								open={false}
							/>
						{/snippet}
					</ResourceBoundary>
				</dd>
			</div>

			<div>
				<dt>Spender</dt>
				<dd>
					<EvmAccountView
						selection={select(EntityType.EvmAccount, selection.entitySelector.$spender)}
						layout={EntityLayout.Value}
						open={false}
					/>
				</dd>
			</div>
		</dl>

		<dl data-column-item="center">
			<div>
				<dt>Interop address</dt>
				<dd>
					<TruncatedValue value={selection.entitySelector.interopAddress} />
				</dd>
			</div>

			<ResourceBoundary
				resource={selection.$spenderContract}
			>
				{#snippet children(evmContract)}
					{#if evmContract != null}
						<div>
							<dt>Spender contract</dt>
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
		</dl>
	{/snippet}

	{#snippet Details({ open: detailsOpen })}
		{@const blocksResource = selection.$$blocks}
		<ResourceBoundary
			resource={blocksResource}
		>
			{#snippet children(entities)}
				{#if entities.values.length > 0}
					<EvmActorCoinAllowance_BlocksView
						selection={blocksResource}
						countResource={blocksResource.count}
						title='Blocks'
						id='blocks'
					/>
				{/if}
			{/snippet}
		</ResourceBoundary>
	{/snippet}
</EntityView>
