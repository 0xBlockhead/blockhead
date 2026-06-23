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
	import HederaContractState_TimestampView from '$/views/HederaContractState_TimestampView.svelte'
</script>


<Page>
	<HederaContractState_TimestampView
		selection={select(EntityType.HederaContractState_Timestamp, data.selector)}
	/>
</Page>
