<!-- Generated from APP.ts. -->

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
	import IcpRequestStatusView from '$/views/IcpRequestStatusView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP request status'} • ICP request status • Blockhead</title>
</svelte:head>


<Page>
	<IcpRequestStatusView
		selection={select(EntityType.IcpRequestStatus, data.selector)}
	/>
</Page>
