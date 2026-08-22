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
	import TezosContractView from '$/views/TezosContractView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos contract'} • tezos contract • Blockhead</title>
</svelte:head>


<Page>
	<TezosContractView
		selection={select(EntityType.TezosContract, data.selector)}
	/>
</Page>
