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
	import TezosOperationGroupView from '$/views/TezosOperationGroupView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'tezos operation group'} • tezos operation group • Blockhead</title>
</svelte:head>


<Page>
	<TezosOperationGroupView
		selection={select(EntityType.TezosOperationGroup, data.selector)}
	/>
</Page>
