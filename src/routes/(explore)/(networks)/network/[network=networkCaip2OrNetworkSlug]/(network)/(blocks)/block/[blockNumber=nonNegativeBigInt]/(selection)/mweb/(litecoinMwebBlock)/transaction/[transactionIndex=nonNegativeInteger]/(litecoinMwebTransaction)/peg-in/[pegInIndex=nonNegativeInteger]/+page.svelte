<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebPegInView from '$/views/LitecoinMwebPegInView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'litecoin MWEB peg in'} • litecoin MWEB peg in • Blockhead</title>
</svelte:head>


<Page>
	<LitecoinMwebPegInView
		selection={
			select(EntityType.LitecoinMwebPegIn, {
				$transaction: data.selector,
				pegInIndex: Number(params.pegInIndex),
			}, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})
		}
	/>
</Page>
