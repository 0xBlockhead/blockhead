<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		entityId={{ chainId: Number(params.networkId) }}
	/>
</Page>
