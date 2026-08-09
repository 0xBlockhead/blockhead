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
	import LitecoinMwebPegOutView from '$/views/LitecoinMwebPegOutView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'litecoin MWEB peg out'} • litecoin MWEB peg out • Blockhead</title>
</svelte:head>


<Page>
	<LitecoinMwebPegOutView
		selection={
			select(EntityType.LitecoinMwebPegOut, {
				$transaction: data.selector,
				pegOutIndex: Number(params.pegOutIndex),
			}, {
				sources: [
					Source.LitecoinCore_JsonRpc,
				],
			})
		}
	/>
</Page>
