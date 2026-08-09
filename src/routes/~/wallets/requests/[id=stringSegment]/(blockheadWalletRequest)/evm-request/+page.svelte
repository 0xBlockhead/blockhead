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
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadEvmWalletRequestView from '$/views/BlockheadEvmWalletRequestView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Blockhead EVM wallet request'} • Blockhead EVM wallet request • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadEvmWalletRequestView
		selection={
			select(EntityType.BlockheadEvmWalletRequest, data.selector, {
				sources: [
					Source.Local_Internal,
				],
			})
		}
	/>
</Page>
