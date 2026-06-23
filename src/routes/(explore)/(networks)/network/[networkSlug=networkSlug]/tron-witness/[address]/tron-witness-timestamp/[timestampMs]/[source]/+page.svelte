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
	import TronWitness_TimestampView from '$/views/TronWitness_TimestampView.svelte'
</script>


<Page>
	<TronWitness_TimestampView
		selection={select(EntityType.TronWitness_Timestamp, data.selector)}
	/>
</Page>
