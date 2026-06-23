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
	import CosmosDelegation_TimestampView from '$/views/CosmosDelegation_TimestampView.svelte'
</script>


<Page>
	<CosmosDelegation_TimestampView
		selection={select(EntityType.CosmosDelegation_Timestamp, data.selector)}
	/>
</Page>
