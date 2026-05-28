<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		entityId={{
			$network: { chainId: evmChainIdFromCaip2RouteParams(params) },
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>

