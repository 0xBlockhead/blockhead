<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmBlockView from '$/views/EvmBlockView.svelte'
</script>


<Page>
		<EvmBlockView
		entityId={{
			$network: { chainId: evmChainIdFromCaip2RouteParams(params) },
			blockNumber: BigInt(params.blockNumber),
		}}
	/>
</Page>

