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
	import IcpLedgerCanister_TimestampView from '$/views/IcpLedgerCanister_TimestampView.svelte'
</script>


<Page>
	<IcpLedgerCanister_TimestampView
		selection={select(EntityType.IcpLedgerCanister_Timestamp, data.selector)}
	/>
</Page>
