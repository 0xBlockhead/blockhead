<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrArticleView from '$/views/NostrArticleView.svelte'
</script>


<Page>
	<NostrArticleView
		selector={data.selector}
	/>
</Page>
