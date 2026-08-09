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
	import TonNftItemView from '$/views/TonNftItemView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'TON NFT item'} • TON NFT item • Blockhead</title>
</svelte:head>


<Page>
	<TonNftItemView
		selection={
			select(EntityType.TonNftItem, {
				$collection: data.selector,
				itemIndex: BigInt(params.itemIndex),
			})
		}
	/>
</Page>
