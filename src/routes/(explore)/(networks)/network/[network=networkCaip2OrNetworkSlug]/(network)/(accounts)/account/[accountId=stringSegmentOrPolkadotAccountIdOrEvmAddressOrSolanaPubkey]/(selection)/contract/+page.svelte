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
	import TonContractView from '$/views/TonContractView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON contract'} • TON contract • Blockhead</title>
</svelte:head>


<Page>
	<TonContractView
		selection={select(EntityType.TonContract, data.selector)}
	/>
</Page>
