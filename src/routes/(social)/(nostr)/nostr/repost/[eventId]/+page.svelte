<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<Page>
	<NostrRepostView
		entityId={data.entityId}
	/>
</Page>
