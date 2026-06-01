<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		entityId={{
			$network: networkIdFromCaip2RouteParams(params),
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>

