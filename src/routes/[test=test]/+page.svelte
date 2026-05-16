<script lang="ts">
	// Components
	import Page from '$/components/Page.svelte'

	let {
		params,
	} = $props()
</script>


<Page>
	<h1>{params.test}</h1>
</Page>
