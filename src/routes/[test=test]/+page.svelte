<script lang="ts">
	// Props
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
</script>


<Page>
	<h1>{params.test}</h1>
</Page>
