<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrNoteView from '$/views/NostrNoteView.svelte'
</script>


<Page>
	<NostrNoteView
		selector={data.selector}
	/>
</Page>
