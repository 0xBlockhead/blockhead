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
	import OracleFeed_TimestampView from '$/views/OracleFeed_TimestampView.svelte'
</script>


<Page>
	<OracleFeed_TimestampView
		selection={select(EntityType.OracleFeed_Timestamp, data.selector)}
	/>
</Page>
