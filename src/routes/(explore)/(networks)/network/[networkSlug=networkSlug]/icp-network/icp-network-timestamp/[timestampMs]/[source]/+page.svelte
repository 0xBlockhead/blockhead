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
	import IcpNetwork_TimestampView from '$/views/IcpNetwork_TimestampView.svelte'
</script>


<Page>
	<IcpNetwork_TimestampView
		selection={select(EntityType.IcpNetwork_Timestamp, data.selector)}
	/>
</Page>
