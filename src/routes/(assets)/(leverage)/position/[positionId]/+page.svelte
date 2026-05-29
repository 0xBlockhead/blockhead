<script lang="ts">
	// Types/constants
	import { networkIdFromEvmChainId } from '$/lib/caip.ts'


	// State
	let {
		params,
	} = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<Page>
	<LeverageView
		entityId={{
			$network: networkIdFromEvmChainId(1),
			id: params.positionId,
		}}
	/>
</Page>
