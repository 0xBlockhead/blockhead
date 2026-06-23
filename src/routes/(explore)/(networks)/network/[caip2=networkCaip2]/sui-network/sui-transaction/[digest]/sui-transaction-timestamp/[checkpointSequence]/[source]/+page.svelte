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
	import SuiTransaction_TimestampView from '$/views/SuiTransaction_TimestampView.svelte'
</script>


<Page>
	<SuiTransaction_TimestampView
		selection={select(EntityType.SuiTransaction_Timestamp, data.selector)}
	/>
</Page>
