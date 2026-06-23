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
	import TonNetwork_TimestampView from '$/views/TonNetwork_TimestampView.svelte'
</script>


<Page>
	<TonNetwork_TimestampView
		selection={select(EntityType.TonNetwork_Timestamp, data.selector)}
	/>
</Page>
