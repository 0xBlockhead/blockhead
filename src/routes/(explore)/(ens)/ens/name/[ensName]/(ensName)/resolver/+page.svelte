<script lang="ts">
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EnsResolverView from '$/views/EnsResolverView.svelte'
</script>


<Page>
	<EnsResolverView
		selector={{ name: params.ensName }}
	/>
</Page>
