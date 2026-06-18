<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmUserOperationView from '$/views/EvmUserOperationView.svelte'
</script>


<Page>
	<EvmUserOperationView
		selector={{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			hash: params.userOperationHash.toLowerCase(),
		}}
	/>
</Page>
