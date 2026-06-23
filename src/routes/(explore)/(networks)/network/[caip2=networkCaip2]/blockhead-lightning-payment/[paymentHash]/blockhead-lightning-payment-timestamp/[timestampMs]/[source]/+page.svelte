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
	import BlockheadLightningPayment_TimestampView from '$/views/BlockheadLightningPayment_TimestampView.svelte'
</script>


<Page>
	<BlockheadLightningPayment_TimestampView
		selection={select(EntityType.BlockheadLightningPayment_Timestamp, data.selector)}
	/>
</Page>
