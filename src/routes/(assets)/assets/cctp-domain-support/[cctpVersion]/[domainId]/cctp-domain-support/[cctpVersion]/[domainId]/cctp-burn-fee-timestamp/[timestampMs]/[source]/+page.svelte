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
	import CctpBurnFee_TimestampView from '$/views/CctpBurnFee_TimestampView.svelte'
</script>


<Page>
	<CctpBurnFee_TimestampView
		selection={select(EntityType.CctpBurnFee_Timestamp, data.selector)}
	/>
</Page>
