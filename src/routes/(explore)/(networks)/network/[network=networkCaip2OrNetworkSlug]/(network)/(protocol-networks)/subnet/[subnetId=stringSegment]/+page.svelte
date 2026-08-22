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
	import IcpSubnetView from '$/views/IcpSubnetView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP subnet'} • ICP subnet • Blockhead</title>
</svelte:head>


<Page>
	<IcpSubnetView
		selection={select(EntityType.IcpSubnet, data.selector)}
	/>
</Page>
