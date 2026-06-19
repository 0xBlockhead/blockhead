<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// Types/constants
	import type { PageProps } from './$types.ts'

	let { data }: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import NostrReactionView from '$/views/NostrReactionView.svelte'
</script>


<Page>
	<NostrReactionView
		selection={select(EntityType.NostrReaction, data.selector)}
	/>
</Page>
