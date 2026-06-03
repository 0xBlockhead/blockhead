<script lang="ts">
	// State
	let { params } = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BeaconEpochView from '$/views/BeaconEpochView.svelte'
</script>


<Page>
	<BeaconEpochView
		entityId={{
			$network: { caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } },
			epoch: Number(params.epochNumber),
		}}
	/>
</Page>
