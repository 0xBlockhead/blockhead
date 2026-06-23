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
	import GlobalEvmAbiCatalog_TimestampView from '$/views/_GlobalEvmAbiCatalog_TimestampView.svelte'
</script>


<Page>
	<GlobalEvmAbiCatalog_TimestampView
		selection={select(EntityType._GlobalEvmAbiCatalog_Timestamp, data.selector)}
	/>
</Page>
