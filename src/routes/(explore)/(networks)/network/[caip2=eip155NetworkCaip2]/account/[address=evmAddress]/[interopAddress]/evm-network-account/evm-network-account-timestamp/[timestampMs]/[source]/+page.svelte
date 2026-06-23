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
	import EvmNetworkAccount_TimestampView from '$/views/EvmNetworkAccount_TimestampView.svelte'
</script>


<Page>
	<EvmNetworkAccount_TimestampView
		selection={select(EntityType.EvmNetworkAccount_Timestamp, data.selector)}
	/>
</Page>
