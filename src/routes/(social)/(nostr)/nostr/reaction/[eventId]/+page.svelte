<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<Page>
	<NostrReactionView
		entityId={data.entityId}
	/>
</Page>
