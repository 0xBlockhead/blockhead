<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconSlotView from '$/views/BeaconSlotView.svelte'
</script>


<Page>
		<BeaconSlotView
			selector={{
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			slot: Number(params.slotNumber),
		}}
	/>
</Page>
