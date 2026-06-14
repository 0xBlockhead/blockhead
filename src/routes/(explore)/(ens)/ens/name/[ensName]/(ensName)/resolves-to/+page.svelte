<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsResolvesToView from '$/views/EnsResolvesToView.svelte'
</script>


<Page>
	<EnsResolvesToView
		selector={{ name: params.ensName }}
	/>
</Page>
