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
	import IcpRequestStatus_TimestampView from '$/views/IcpRequestStatus_TimestampView.svelte'
</script>


<Page>
	<IcpRequestStatus_TimestampView
		selection={select(EntityType.IcpRequestStatus_Timestamp, data.selector)}
	/>
</Page>
