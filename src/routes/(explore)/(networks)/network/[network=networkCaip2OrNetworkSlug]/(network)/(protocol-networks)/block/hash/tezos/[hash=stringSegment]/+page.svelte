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
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import TezosBlockView from '$/views/TezosBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'tezos block'} • tezos block • Blockhead</title>
</svelte:head>


<Page>
	<TezosBlockView
		selection={
			select(EntityType.TezosBlock, {
				$network: data.selector,
				hash: params.hash,
			})
		}
	/>
</Page>
