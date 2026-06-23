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
	import LogosBlockchainNetwork_TimestampView from '$/views/LogosBlockchainNetwork_TimestampView.svelte'
</script>


<Page>
	<LogosBlockchainNetwork_TimestampView
		selection={select(EntityType.LogosBlockchainNetwork_Timestamp, data.selector)}
	/>
</Page>
