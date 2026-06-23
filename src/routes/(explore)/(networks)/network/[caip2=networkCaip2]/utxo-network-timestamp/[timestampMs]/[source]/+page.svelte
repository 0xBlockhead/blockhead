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
	import UtxoNetwork_TimestampView from '$/views/UtxoNetwork_TimestampView.svelte'
</script>


<Page>
	<UtxoNetwork_TimestampView
		selection={select(EntityType.UtxoNetwork_Timestamp, data.selector)}
	/>
</Page>
