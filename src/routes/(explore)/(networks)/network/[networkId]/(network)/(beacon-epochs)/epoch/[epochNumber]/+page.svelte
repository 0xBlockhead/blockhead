<script lang="ts">
	// Props
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>

