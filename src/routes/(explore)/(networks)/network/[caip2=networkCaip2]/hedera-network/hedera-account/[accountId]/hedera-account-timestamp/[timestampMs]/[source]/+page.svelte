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
	import HederaAccount_TimestampView from '$/views/HederaAccount_TimestampView.svelte'
</script>


<Page>
	<HederaAccount_TimestampView
		selection={select(EntityType.HederaAccount_Timestamp, data.selector)}
	/>
</Page>
