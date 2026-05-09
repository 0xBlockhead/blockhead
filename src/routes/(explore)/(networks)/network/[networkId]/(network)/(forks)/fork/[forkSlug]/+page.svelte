<script lang="ts">
	// Types/constants
	import { networkForkIdFromChainIdAndUrlSegment } from '$/constants/EthereumExecutionForks.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()

	// Components
	import NetworkForkView from '$/views/NetworkForkView.svelte'
	import Page from '$/components/Page.svelte'
</script>


<Page>
		<NetworkForkView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			forkId: (
				networkForkIdFromChainIdAndUrlSegment(
					Number(params.networkId),
					params.forkSlug,
				) ?? params.forkSlug
			),
		}}
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
			params,
		)}
	/>
</Page>

