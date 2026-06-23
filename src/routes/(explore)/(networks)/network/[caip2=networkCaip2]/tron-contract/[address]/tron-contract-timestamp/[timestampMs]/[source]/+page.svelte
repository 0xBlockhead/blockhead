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
	import TronContract_TimestampView from '$/views/TronContract_TimestampView.svelte'
</script>


<Page>
	<TronContract_TimestampView
		selection={select(EntityType.TronContract_Timestamp, data.selector)}
	/>
</Page>
