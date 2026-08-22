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
	import TonBlockView from '$/views/TonBlockView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'TON block'} • TON block • Blockhead</title>
</svelte:head>


<Page>
	<TonBlockView
		selection={
			select(EntityType.TonBlock, {
				$network: data.selector,
				rootHash: params.rootHash,
				fileHash: params.fileHash,
			})
		}
	/>
</Page>
