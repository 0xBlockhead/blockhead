<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// State
	let {
		data,
	}: PageProps = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import NostrRepostView from '$/views/NostrRepostView.svelte'
</script>


<Page>
	<NostrRepostView
		selection={
			select(
				EntityType.NostrRepost,
				data.selector
			)
		}
	/>
</Page>
