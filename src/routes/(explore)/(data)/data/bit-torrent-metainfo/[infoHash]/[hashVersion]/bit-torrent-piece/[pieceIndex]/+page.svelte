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
	import BitTorrentPieceView from '$/views/BitTorrentPieceView.svelte'
</script>


<Page>
	<BitTorrentPieceView
		selection={select(EntityType.BitTorrentPiece, data.selector)}
	/>
</Page>
