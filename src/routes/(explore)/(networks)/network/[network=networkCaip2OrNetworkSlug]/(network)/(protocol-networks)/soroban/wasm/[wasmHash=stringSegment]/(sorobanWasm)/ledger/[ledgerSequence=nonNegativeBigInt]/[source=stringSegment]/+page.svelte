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
	import SorobanWasm_TimestampView from '$/views/SorobanWasm_TimestampView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'soroban Wasm timestamp'} • soroban Wasm timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SorobanWasm_TimestampView
		selection={
			select(EntityType.SorobanWasm_Timestamp, {
				$wasm: data.selector,
				ledgerSequence: BigInt(params.ledgerSequence),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
