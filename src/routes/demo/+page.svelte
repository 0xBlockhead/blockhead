<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
</script>


<svelte:head>
	<title>Demo • Blockhead</title>
</svelte:head>


<Page>
	<main data-column>
		<section data-card>
			<h1>Demo</h1>

			<a href={resolve('/test/resource-boundary')}>Resource boundary test route</a>
		</section>
	</main>
</Page>
