<script lang="ts">
	// Types/constants
	import { EntityMetaKey } from '$/schema/$schema.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'
	import { caip2ParamValueFromString } from '$/lib/caip2.ts'


	// Context
	import { writeLocalBlockheadWalletAccount } from '$/collections/localMutations.ts'
	import { getAppClient, select } from '$/routes/+layout.svelte'


	// State
	let {
		facet = 'balances',
		id = 'wallet-account-portfolio',
	}: {
		facet?: 'balances' | 'transactions'
		id?: string
	} = $props()

	let network = $state('')
	let address = $state('')
	let status = $state('')

	const accounts = $derived(
		select(EntityType._Global, {
			scope: '$$blockheadWalletAccounts',
		}).$$blockheadWalletAccounts({
			sources: [Source.Local_Internal],
			fields: {
				caip10: true,
				address: true,
				label: true,
			},
		})
	)


	// Components
	import AptosCoinBalance_TimestampsView from '$/views/AptosCoinBalance_TimestampsView.svelte'
	import AptosTransactionsView from '$/views/AptosTransactionsView.svelte'
	import BlockheadWalletAccountView from '$/views/BlockheadWalletAccountView.svelte'
	import EvmNetworkActorCoinBalancesView from '$/views/EvmNetworkActorCoinBalancesView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import { EntityLayout } from '$/components/EntityView.svelte'
	import PolkadotAccount_TimestampsView from '$/views/PolkadotAccount_TimestampsView.svelte'
	import ResourceBoundary from '$/components/ResourceBoundary.svelte'
	import SolanaAccount_TimestampsView from '$/views/SolanaAccount_TimestampsView.svelte'
	import TronAccount_TimestampsView from '$/views/TronAccount_TimestampsView.svelte'
	import TronAccountTokenBalance_TimestampsView from '$/views/TronAccountTokenBalance_TimestampsView.svelte'
	import TronTransactionsView from '$/views/TronTransactionsView.svelte'
</script>


<article
	data-card
	data-column-item="flexible"
	data-scroll-container
>
	<form
		data-column="gap-2"
		onsubmit={(event) => {
			event.preventDefault()
			const caip2 = caip2ParamValueFromString(network)
			if (caip2 === undefined) {
				status = 'Enter a CAIP-2 network such as eip155:1.'
				return
			}

			writeLocalBlockheadWalletAccount(getAppClient(), {
				...caip2,
				accountAddress: address,
				capabilities: [],
			})
			status = `Added ${network}:${address}.`
			address = ''
		}}
	>
		<header data-row="between wrap align-center gap-2">
			<h2>Add account</h2>
			<span data-text="annotation">Any CAIP-2 network and address</span>
		</header>

		<label for={`${id}-network`}>Network (CAIP-2)</label>
		<input
			id={`${id}-network`}
			name="network"
			bind:value={network}
			placeholder="eip155:1"
			pattern="[^:]+:[^:]+"
			required
		/>

		<label for={`${id}-address`}>Account address</label>
		<input
			id={`${id}-address`}
			name="address"
			bind:value={address}
			required
		/>

		<button type="submit">Add account</button>

		{#if status !== ''}
			<p role="status">{status}</p>
		{/if}
	</form>
</article>

<ResourceBoundary resource={accounts}>
	{#snippet children(resolvedAccounts)}
		{#if resolvedAccounts.values.length > 0}
			{#each resolvedAccounts.values as account (account[EntityMetaKey.SelectorKey])}
				{@const caip10 = account.caip10}
				{#if (
					caip10.namespace === 'eip155'
					|| caip10.namespace === 'tron'
					|| caip10.namespace === 'aptos'
					|| facet === 'balances' && (
						caip10.namespace === 'polkadot'
						|| caip10.namespace === 'solana'
					)
				)}
					<BlockheadWalletAccountView
						selection={select(EntityType.BlockheadWalletAccount, {
							caip10,
						}, {
							sources: [Source.Local_Internal],
						})}
						prefetched={account}
						layout={EntityLayout.Summary}
						open={false}
					/>
				{/if}

				{#if caip10.namespace === 'eip155'}
					{@const selection = select(EntityType.EvmNetworkAccount, {
						$network: {
							caip2: {
								namespace: caip10.namespace,
								reference: caip10.reference,
							},
						},
						$actor: {
							address: caip10.accountAddress,
						},
					})}
					{#if facet === 'balances'}
						<EvmNetworkActorCoinBalancesView
							selection={selection.$$ownedCoins}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-balances`}
						/>
					{:else}
						<EvmTransactionsView
							selection={selection.$$transactions}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-transactions`}
						/>
					{/if}
				{:else if caip10.namespace === 'polkadot' && facet === 'balances'}
					<PolkadotAccount_TimestampsView
						selection={select(EntityType.PolkadotAccount, {
							$network: {
								caip2: {
									namespace: caip10.namespace,
									reference: caip10.reference,
								},
							},
							accountId: caip10.accountAddress,
						}).$$timestamps}
						id={`${id}-${account[EntityMetaKey.SelectorKey]}-balances`}
					/>
				{:else if caip10.namespace === 'solana' && facet === 'balances'}
					<SolanaAccount_TimestampsView
						selection={select(EntityType.SolanaAccount, {
							$network: {
								caip2: {
									namespace: caip10.namespace,
									reference: caip10.reference,
								},
							},
							pubkey: caip10.accountAddress,
						}).$$timestamps}
						id={`${id}-${account[EntityMetaKey.SelectorKey]}-balances`}
					/>
				{:else if caip10.namespace === 'tron'}
					{@const selection = select(EntityType.TronAccount, {
						$network: {
							caip2: {
								namespace: caip10.namespace,
								reference: caip10.reference,
							},
						},
						address: caip10.accountAddress,
					})}
					{#if facet === 'balances'}
						<TronAccount_TimestampsView
							selection={selection.$$timestamps}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-native-balances`}
						/>

						<TronAccountTokenBalance_TimestampsView
							selection={selection.$$tokenBalanceTimestamps}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-token-balances`}
						/>
					{:else}
						<TronTransactionsView
							selection={selection.$$transactions}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-transactions`}
						/>
					{/if}
				{:else if caip10.namespace === 'aptos'}
					{@const selection = select(EntityType.AptosAccount, {
						$network: {
							$network: {
								caip2: {
									namespace: caip10.namespace,
									reference: caip10.reference,
								},
							},
						},
						address: caip10.accountAddress,
					})}
					{#if facet === 'balances'}
						<AptosCoinBalance_TimestampsView
							selection={selection.$$balances}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-balances`}
						/>
					{:else}
						<AptosTransactionsView
							selection={selection.$$transactions}
							id={`${id}-${account[EntityMetaKey.SelectorKey]}-transactions`}
						/>
					{/if}
				{/if}
			{/each}
		{/if}
	{/snippet}
</ResourceBoundary>
