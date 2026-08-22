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
	import EvmContractSourceBundleView from '$/views/EvmContractSourceBundleView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'EVM contract source bundle'} • EVM contract source bundle • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractSourceBundleView
		selection={
			select(EntityType.EvmContractSourceBundle, {
				$contract: data.selector,
			})
		}
	/>
</Page>
