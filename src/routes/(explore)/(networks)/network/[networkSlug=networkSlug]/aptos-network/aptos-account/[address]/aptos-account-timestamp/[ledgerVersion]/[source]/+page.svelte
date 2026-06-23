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
	import AptosAccount_TimestampView from '$/views/AptosAccount_TimestampView.svelte'
</script>


<Page>
	<AptosAccount_TimestampView
		selection={select(EntityType.AptosAccount_Timestamp, data.selector)}
	/>
</Page>
