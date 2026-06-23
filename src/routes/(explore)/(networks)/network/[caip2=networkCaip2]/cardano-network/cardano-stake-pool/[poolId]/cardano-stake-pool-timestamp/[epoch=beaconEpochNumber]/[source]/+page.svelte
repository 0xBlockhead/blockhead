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
	import CardanoStakePool_TimestampView from '$/views/CardanoStakePool_TimestampView.svelte'
</script>


<Page>
	<CardanoStakePool_TimestampView
		selection={select(EntityType.CardanoStakePool_Timestamp, data.selector)}
	/>
</Page>
