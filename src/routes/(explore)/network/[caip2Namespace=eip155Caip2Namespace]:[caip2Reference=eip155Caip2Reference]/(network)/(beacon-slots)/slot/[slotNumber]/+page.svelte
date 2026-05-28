<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
		<BeaconSlotView
		entityId={{
			$network: { chainId: evmChainIdFromCaip2RouteParams(params) },
			slot: Number(params.slotNumber),
		}}
	/>
</Page>

