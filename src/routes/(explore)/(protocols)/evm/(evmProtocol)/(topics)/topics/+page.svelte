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
	import EvmTopicsView from '$/views/EvmTopicsView.svelte'
</script>


<svelte:head>
	<title>EVM topics • Blockhead</title>
</svelte:head>


<Page>
	<EvmTopicsView
		href={resolve('/evm/topics')}
		title='EVM topics'
		selection={
			select(EntityType.EvmProtocol, {
				scope: 'EvmProtocol',
			}).$$evmTopics({
				sources: [
					Source.Openchain_Rest,
				],
				count: true,
			})
		}
		id='evm-topics'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
