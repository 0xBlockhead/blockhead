<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
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
		href={resolve(
			'/(explore)/(networks)/network/[networkId]/(network)/(beacon-slots)/slot/[slotNumber]',
			params,
		)}
	/>
</Page>

