<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<svelte:head>
	<title>EVM errors • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.EvmProtocol, {
		scope: 'EvmProtocol',
	})
		.$$evmErrors({
			sources: [
				Source.Openchain_Rest,
			],
		})}

	<EvmErrorsView
		href={resolve('/(explore)/(protocols)/evm/(evmProtocol)/(errors)/errors')}
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='evm-errors'
	/>
</Page>
