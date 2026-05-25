<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
		<BeaconSlotView
		entityId={{
			$network: { chainId: Number(params.networkId) },
			slot: Number(params.slotNumber),
		}}
	/>
</Page>

