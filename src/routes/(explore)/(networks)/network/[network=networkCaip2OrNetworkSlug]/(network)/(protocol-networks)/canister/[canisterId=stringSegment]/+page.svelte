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
	import IcpCanisterView from '$/views/IcpCanisterView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP canister'} • ICP canister • Blockhead</title>
</svelte:head>


<Page>
	<IcpCanisterView
		selection={select(EntityType.IcpCanister, data.selector)}
	/>
</Page>
