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
	import PythPriceFeed_TimestampView from '$/views/PythPriceFeed_TimestampView.svelte'
</script>


<Page>
	<PythPriceFeed_TimestampView
		selection={select(EntityType.PythPriceFeed_Timestamp, data.selector)}
	/>
</Page>
