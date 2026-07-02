<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import PolkadotBlockView from '$/views/PolkadotBlockView.svelte'
</script>


<svelte:head>
	<title>Polkadot block • Blockhead</title>
</svelte:head>


<Page>
	<PolkadotBlockView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/block/[blockNumber=nonNegativeInteger]/[hash]', {
				networkSlug: params.networkSlug,
				blockNumber: params.blockNumber,
				hash: params.hash,
			})
		}
		selection={
			select(EntityType.PolkadotBlock, data.selector, {
				fields: {
					stateRoot: true,
					extrinsicsRoot: true,
					$parent: true,
				},
			})
		}
	/>
</Page>
