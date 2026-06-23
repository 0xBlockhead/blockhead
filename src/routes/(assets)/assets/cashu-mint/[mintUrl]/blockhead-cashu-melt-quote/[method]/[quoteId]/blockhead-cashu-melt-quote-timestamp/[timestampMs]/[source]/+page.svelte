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
	import BlockheadCashuMeltQuote_TimestampView from '$/views/BlockheadCashuMeltQuote_TimestampView.svelte'
</script>


<Page>
	<BlockheadCashuMeltQuote_TimestampView
		selection={select(EntityType.BlockheadCashuMeltQuote_Timestamp, data.selector)}
	/>
</Page>
