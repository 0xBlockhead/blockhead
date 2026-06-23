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
	import TronNetwork_TimestampView from '$/views/TronNetwork_TimestampView.svelte'
</script>


<Page>
	<TronNetwork_TimestampView
		selection={select(EntityType.TronNetwork_Timestamp, data.selector)}
	/>
</Page>
