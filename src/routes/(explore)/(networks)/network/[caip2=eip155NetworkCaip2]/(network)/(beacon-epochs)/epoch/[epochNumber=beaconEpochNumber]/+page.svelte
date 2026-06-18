<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		selector={{
			$network: eip155NetworkSelectorFromCaip2(params.caip2),
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>
