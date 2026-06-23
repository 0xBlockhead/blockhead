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
	import AptosTableItem_TimestampView from '$/views/AptosTableItem_TimestampView.svelte'
</script>


<Page>
	<AptosTableItem_TimestampView
		selection={select(EntityType.AptosTableItem_Timestamp, data.selector)}
	/>
</Page>
