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
			slug: params.networkSlug,
		}}
	/>
</Page>
