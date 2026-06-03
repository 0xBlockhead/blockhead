<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		entityId={{ caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } }}
	/>
</Page>
