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
	import TonTrace_TimestampView from '$/views/TonTrace_TimestampView.svelte'
</script>


<Page>
	<TonTrace_TimestampView
		selection={select(EntityType.TonTrace_Timestamp, data.selector)}
	/>
</Page>
