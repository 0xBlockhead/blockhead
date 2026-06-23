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
	import IcpCanisterLog_TimestampView from '$/views/IcpCanisterLog_TimestampView.svelte'
</script>


<Page>
	<IcpCanisterLog_TimestampView
		selection={select(EntityType.IcpCanisterLog_Timestamp, data.selector)}
	/>
</Page>
