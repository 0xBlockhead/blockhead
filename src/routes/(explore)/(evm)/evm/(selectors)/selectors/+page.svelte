<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmSelectorsView from '$/views/EvmSelectorsView.svelte'
</script>


<svelte:head>
	<title>EVM selectors • Blockhead</title>
</svelte:head>


<Page>
	<EvmSelectorsView
		href={resolve('/(explore)/(evm)/evm/(selectors)/selectors')}
		title='EVM selectors'
		selection={
			select(EntityType.EvmProtocol, {
				scope: 'EvmProtocol',
			}).$$evmSelectors({
				sources: [
					Source.Openchain_Rest,
				],
			})
		}
		id='evm-selectors'
	/>
</Page>
