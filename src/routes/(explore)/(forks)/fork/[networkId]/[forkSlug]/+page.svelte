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
	import { EntityLayout } from '$/components/EntityView.svelte'
	import Page from '$/components/Page.svelte'
	import NetworkForkView from '$/views/NetworkForkView.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<section>
		<NetworkView
			entityId={{ chainId: Number(params.networkId) }}
			href={resolve('/(explore)/(networks)/network/[networkId]', {
				networkId: params.networkId,
			})}
			layout={EntityLayout.Summary}
			open={false}
		/>
	</section>

	<section>
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
			href={resolve('/(explore)/(forks)/fork/[networkId]/[forkSlug]', params)}
		/>
	</section>
</Page>
