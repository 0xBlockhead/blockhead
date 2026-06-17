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
		selector={{
			caip2: {
				namespace: params.caip2.slice(0, params.caip2.indexOf(':')),
				reference: params.caip2.slice(params.caip2.indexOf(':') + 1),
			},
		}}
	/>
</Page>
