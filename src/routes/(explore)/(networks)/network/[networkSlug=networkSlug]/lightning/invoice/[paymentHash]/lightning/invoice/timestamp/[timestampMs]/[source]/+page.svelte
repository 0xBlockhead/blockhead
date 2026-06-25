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
	import BlockheadLightningInvoice_TimestampView from '$/views/BlockheadLightningInvoice_TimestampView.svelte'
</script>


<Page>
	<BlockheadLightningInvoice_TimestampView
		selection={select(EntityType.BlockheadLightningInvoice_Timestamp, data.selector)}
	/>
</Page>
