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
	import IcpCanister_TimestampView from '$/views/IcpCanister_TimestampView.svelte'
</script>


<Page>
	<IcpCanister_TimestampView
		selection={select(EntityType.IcpCanister_Timestamp, data.selector)}
	/>
</Page>
