<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlocksView from '$/views/EvmBlocksView.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
	import EvmTransactionsView from '$/views/EvmTransactionsView.svelte'
	import NetworkForksView from '$/views/NetworkForksView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		entityId={{ chainId: Number(params.networkId) }}
		href={resolve('/(explore)/(networks)/network/[networkId]', params)}
	>
		{#snippet children()}
			<section>
				<EvmBlocksView
					entityId={{ chainId: Number(params.networkId) }}
					href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', params)}
					id="blocks"
				/>
			</section>

			<section>
				<EvmTransactionsView
					entityId={{ chainId: Number(params.networkId) }}
					href={resolve('/(explore)/(networks)/network/[networkId]/(network)/transactions', params)}
					id="transactions"
				/>
			</section>

			<section>
				<NetworkForksView
					entityId={{ chainId: Number(params.networkId) }}
					href={resolve('/(explore)/(networks)/network/[networkId]/(network)/forks', params)}
					id="forks"
				/>
			</section>

			<section>
				<EvmContractsView
					href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', params)}
					id="contracts"
				/>
			</section>
		{/snippet}
	</NetworkView>
</Page>
