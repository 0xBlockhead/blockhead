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
	import CctpFastBurnAllowance_TimestampView from '$/views/CctpFastBurnAllowance_TimestampView.svelte'
</script>


<Page>
	<CctpFastBurnAllowance_TimestampView
		selection={select(EntityType.CctpFastBurnAllowance_Timestamp, data.selector)}
	/>
</Page>
