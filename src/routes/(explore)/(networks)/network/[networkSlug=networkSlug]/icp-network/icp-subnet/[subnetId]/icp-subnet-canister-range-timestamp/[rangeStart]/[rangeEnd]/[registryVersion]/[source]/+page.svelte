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
	import IcpSubnetCanisterRange_TimestampView from '$/views/IcpSubnetCanisterRange_TimestampView.svelte'
</script>


<Page>
	<IcpSubnetCanisterRange_TimestampView
		selection={select(EntityType.IcpSubnetCanisterRange_Timestamp, data.selector)}
	/>
</Page>
