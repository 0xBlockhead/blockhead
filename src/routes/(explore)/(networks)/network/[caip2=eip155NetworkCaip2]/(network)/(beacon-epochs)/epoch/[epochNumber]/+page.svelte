<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		selector={{
			$network: { caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } },
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>
