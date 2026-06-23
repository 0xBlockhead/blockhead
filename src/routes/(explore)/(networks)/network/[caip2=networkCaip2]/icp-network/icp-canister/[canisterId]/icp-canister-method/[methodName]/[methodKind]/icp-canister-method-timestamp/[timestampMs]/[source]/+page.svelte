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
	import IcpCanisterMethod_TimestampView from '$/views/IcpCanisterMethod_TimestampView.svelte'
</script>


<Page>
	<IcpCanisterMethod_TimestampView
		selection={select(EntityType.IcpCanisterMethod_Timestamp, data.selector)}
	/>
</Page>
