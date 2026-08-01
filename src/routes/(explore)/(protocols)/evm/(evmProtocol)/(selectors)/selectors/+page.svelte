<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
</script>


<svelte:head>
	<title>EVM selectors • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.EvmProtocol, {
		scope: 'EvmProtocol',
	})
		.$$evmSelectors({
			sources: [
				Source.Openchain_Rest,
			],
		})}

	<EvmSelectorsView
		href={resolve('/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selectors')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='evm-selectors'
	/>
</Page>
