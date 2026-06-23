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
	import IcpSubnet_TimestampView from '$/views/IcpSubnet_TimestampView.svelte'
</script>


<Page>
	<IcpSubnet_TimestampView
		selection={select(EntityType.IcpSubnet_Timestamp, data.selector)}
	/>
</Page>
