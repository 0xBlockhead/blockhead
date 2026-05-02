<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<Page>
	<section>
		<EvmBlockView
			entityId={{
				$network: { chainId: Number(params.networkId) },
				blockNumber: BigInt(params.blockNumber),
			}}
			href={resolve(
				'/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]',
				params,
			)}
		/>
	</section>
</Page>
