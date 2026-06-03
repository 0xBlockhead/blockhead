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
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			slot: Number(params.slotNumber),
		}}
	/>
</Page>
