<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import LiquidityPoolView from '$/views/LiquidityPoolView.svelte'
</script>


<Page>
	<LiquidityPoolView
		entityId={{
			$network: { chainId: 1 },
			id: params.poolId,
		}}
		href={resolve('/(assets)/(pools)/pool/[poolId]', params)}
	/>
</Page>
