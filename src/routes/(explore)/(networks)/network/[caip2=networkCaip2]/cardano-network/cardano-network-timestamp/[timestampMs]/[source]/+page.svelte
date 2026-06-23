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
	import CardanoNetwork_TimestampView from '$/views/CardanoNetwork_TimestampView.svelte'
</script>


<Page>
	<CardanoNetwork_TimestampView
		selection={select(EntityType.CardanoNetwork_Timestamp, data.selector)}
	/>
</Page>
