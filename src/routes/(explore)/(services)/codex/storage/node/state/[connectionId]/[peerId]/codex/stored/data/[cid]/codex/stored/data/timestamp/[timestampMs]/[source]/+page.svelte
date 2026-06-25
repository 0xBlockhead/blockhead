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
	import BlockheadCodexStoredData_TimestampView from '$/views/BlockheadCodexStoredData_TimestampView.svelte'
</script>


<Page>
	<BlockheadCodexStoredData_TimestampView
		selection={select(EntityType.BlockheadCodexStoredData_Timestamp, data.selector)}
	/>
</Page>
