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
	import SuiCoinBalance_TimestampView from '$/views/SuiCoinBalance_TimestampView.svelte'
</script>


<Page>
	<SuiCoinBalance_TimestampView
		selection={select(EntityType.SuiCoinBalance_Timestamp, data.selector)}
	/>
</Page>
