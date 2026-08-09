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

	const pageSelection = $derived(select(EntityType.LitecoinMwebOutput, {
		$transaction: data.selector,
		outputIndex: Number(params.outputIndex),
	}, {
		sources: [
			Source.LitecoinCore_JsonRpc,
		],
		fields: {
			commitment: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import LitecoinMwebOutputView from '$/views/LitecoinMwebOutputView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? 'litecoin MWEB output' : (pageSelection.entity.commitment ?? '') || 'litecoin MWEB output')} • litecoin MWEB output • Blockhead</title>
</svelte:head>


<Page>
	<LitecoinMwebOutputView
		selection={pageSelection}
	/>
</Page>
