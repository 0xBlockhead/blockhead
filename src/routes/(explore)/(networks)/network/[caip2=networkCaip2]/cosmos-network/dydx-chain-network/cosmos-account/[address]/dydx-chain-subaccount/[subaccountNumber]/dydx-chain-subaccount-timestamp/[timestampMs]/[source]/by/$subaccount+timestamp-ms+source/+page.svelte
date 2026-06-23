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
	import DydxChainSubaccount_TimestampView from '$/views/DydxChainSubaccount_TimestampView.svelte'
</script>


<Page>
	<DydxChainSubaccount_TimestampView
		selection={select(EntityType.DydxChainSubaccount_Timestamp, data.selector)}
	/>
</Page>
