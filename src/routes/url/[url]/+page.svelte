<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// State
	let {
		data,
	}: PageProps = $props()

	// Components
	import Page from '$/components/Page.svelte'
	import UrlView from '$/views/UrlView.svelte'
</script>


<Page>
	<UrlView selector={data.selector} />
</Page>
