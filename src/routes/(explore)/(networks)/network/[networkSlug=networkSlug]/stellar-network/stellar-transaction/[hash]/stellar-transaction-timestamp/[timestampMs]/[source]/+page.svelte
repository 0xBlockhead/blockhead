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
	import StellarTransaction_TimestampView from '$/views/StellarTransaction_TimestampView.svelte'
</script>


<Page>
	<StellarTransaction_TimestampView
		selection={select(EntityType.StellarTransaction_Timestamp, data.selector)}
	/>
</Page>
