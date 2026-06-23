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
	import CardanoDRep_TimestampView from '$/views/CardanoDRep_TimestampView.svelte'
</script>


<Page>
	<CardanoDRep_TimestampView
		selection={select(EntityType.CardanoDRep_Timestamp, data.selector)}
	/>
</Page>
