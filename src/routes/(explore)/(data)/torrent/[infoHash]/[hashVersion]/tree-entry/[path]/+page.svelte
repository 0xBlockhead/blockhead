<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BitTorrentFileTreeEntryView from '$/views/BitTorrentFileTreeEntryView.svelte'
</script>


<Page>
	<BitTorrentFileTreeEntryView
		selection={select(EntityType.BitTorrentFileTreeEntry, data.selector)}
	/>
</Page>
