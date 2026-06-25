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
	import BlockheadCashuMintQuote_TimestampView from '$/views/BlockheadCashuMintQuote_TimestampView.svelte'
</script>


<Page>
	<BlockheadCashuMintQuote_TimestampView
		selection={select(EntityType.BlockheadCashuMintQuote_Timestamp, data.selector)}
	/>
</Page>
