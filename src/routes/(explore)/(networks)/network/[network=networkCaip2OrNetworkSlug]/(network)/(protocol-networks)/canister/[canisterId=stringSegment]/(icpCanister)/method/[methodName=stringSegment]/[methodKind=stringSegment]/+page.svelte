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
	import IcpCanisterMethodView from '$/views/IcpCanisterMethodView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'ICP canister method'} • ICP canister method • Blockhead</title>
</svelte:head>


<Page>
	<IcpCanisterMethodView
		selection={select(EntityType.IcpCanisterMethod, data.selector)}
	/>
</Page>
