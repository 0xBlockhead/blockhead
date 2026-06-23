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
	import CardanoAddress_TimestampView from '$/views/CardanoAddress_TimestampView.svelte'
</script>


<Page>
	<CardanoAddress_TimestampView
		selection={select(EntityType.CardanoAddress_Timestamp, data.selector)}
	/>
</Page>
