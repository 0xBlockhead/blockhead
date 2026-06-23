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
	import HederaAllowance_TimestampView from '$/views/HederaAllowance_TimestampView.svelte'
</script>


<Page>
	<HederaAllowance_TimestampView
		selection={select(EntityType.HederaAllowance_Timestamp, data.selector)}
	/>
</Page>
