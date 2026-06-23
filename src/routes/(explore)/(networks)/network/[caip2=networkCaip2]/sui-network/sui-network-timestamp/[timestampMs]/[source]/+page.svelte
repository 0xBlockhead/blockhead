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
	import SuiNetwork_TimestampView from '$/views/SuiNetwork_TimestampView.svelte'
</script>


<Page>
	<SuiNetwork_TimestampView
		selection={select(EntityType.SuiNetwork_Timestamp, data.selector)}
	/>
</Page>
