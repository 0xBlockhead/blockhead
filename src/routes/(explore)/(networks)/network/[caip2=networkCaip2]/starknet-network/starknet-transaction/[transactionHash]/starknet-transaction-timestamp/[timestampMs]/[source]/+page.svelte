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
	import StarknetTransaction_TimestampView from '$/views/StarknetTransaction_TimestampView.svelte'
</script>


<Page>
	<StarknetTransaction_TimestampView
		selection={select(EntityType.StarknetTransaction_Timestamp, data.selector)}
	/>
</Page>
