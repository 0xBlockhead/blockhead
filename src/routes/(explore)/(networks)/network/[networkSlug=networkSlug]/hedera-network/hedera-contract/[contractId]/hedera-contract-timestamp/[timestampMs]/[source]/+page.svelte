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
	import HederaContract_TimestampView from '$/views/HederaContract_TimestampView.svelte'
</script>


<Page>
	<HederaContract_TimestampView
		selection={select(EntityType.HederaContract_Timestamp, data.selector)}
	/>
</Page>
