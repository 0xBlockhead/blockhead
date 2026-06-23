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
	import HederaNetworkFee_TimestampView from '$/views/HederaNetworkFee_TimestampView.svelte'
</script>


<Page>
	<HederaNetworkFee_TimestampView
		selection={select(EntityType.HederaNetworkFee_Timestamp, data.selector)}
	/>
</Page>
