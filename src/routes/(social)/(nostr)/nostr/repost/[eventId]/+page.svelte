<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<Page>
	<NostrRepostView
		selection={select(EntityType.NostrRepost, data.selector)}
	/>
</Page>
