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
	import TonContract_TimestampView from '$/views/TonContract_TimestampView.svelte'
</script>


<Page>
	<TonContract_TimestampView
		selection={select(EntityType.TonContract_Timestamp, data.selector)}
	/>
</Page>
