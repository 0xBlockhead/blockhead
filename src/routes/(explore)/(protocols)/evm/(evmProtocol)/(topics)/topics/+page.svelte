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
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<svelte:head>
	<title>EVM topics • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.EvmProtocol, {
		scope: 'EvmProtocol',
	})
		.$$evmTopics({
			sources: [
				Source.Openchain_Rest,
			],
		})}

	<EvmTopicsView
		href={resolve('/(explore)/(protocols)/evm/(evmProtocol)/(topics)/topics')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='evm-topics'
	/>
</Page>
