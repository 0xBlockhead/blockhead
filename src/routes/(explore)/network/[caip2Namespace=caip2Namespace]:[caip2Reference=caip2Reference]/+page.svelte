<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


	// State
	let {
		params,
	} = $props()

	const networkEntityId = $derived(
		networkIdFromCaip2RouteParams(params),
	)


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		entityId={networkEntityId}
	/>
</Page>
