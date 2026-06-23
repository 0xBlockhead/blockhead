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
	import IcpLedgerAccount_TimestampView from '$/views/IcpLedgerAccount_TimestampView.svelte'
</script>


<Page>
	<IcpLedgerAccount_TimestampView
		selection={select(EntityType.IcpLedgerAccount_Timestamp, data.selector)}
	/>
</Page>
