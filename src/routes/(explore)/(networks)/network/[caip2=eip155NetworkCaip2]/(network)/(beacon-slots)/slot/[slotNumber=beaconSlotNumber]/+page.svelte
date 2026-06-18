<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
		<BeaconSlotView
			selector={{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			slot: Number(params.slotNumber),
		}}
	/>
</Page>
