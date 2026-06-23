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
	import AvalanchePChainTransaction_TimestampView from '$/views/AvalanchePChainTransaction_TimestampView.svelte'
</script>


<Page>
	<AvalanchePChainTransaction_TimestampView
		selection={select(EntityType.AvalanchePChainTransaction_Timestamp, data.selector)}
	/>
</Page>
