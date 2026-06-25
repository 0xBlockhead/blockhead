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
	import AiProviderApiOperation_TimestampView from '$/views/AiProviderApiOperation_TimestampView.svelte'
</script>


<Page>
	<AiProviderApiOperation_TimestampView
		selection={select(EntityType.AiProviderApiOperation_Timestamp, data.selector)}
	/>
</Page>
