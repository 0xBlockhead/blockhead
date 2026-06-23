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
	import AlgorandAccount_TimestampView from '$/views/AlgorandAccount_TimestampView.svelte'
</script>


<Page>
	<AlgorandAccount_TimestampView
		selection={select(EntityType.AlgorandAccount_Timestamp, data.selector)}
	/>
</Page>
