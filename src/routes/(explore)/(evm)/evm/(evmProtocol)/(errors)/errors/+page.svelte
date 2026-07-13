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
	import EvmErrorsView from '$/views/EvmErrorsView.svelte'
</script>


<svelte:head>
	<title>EVM errors • Blockhead</title>
</svelte:head>


<Page>
	<EvmErrorsView
		href={resolve('/evm/errors')}
		title='EVM errors'
		selection={
			select(EntityType.EvmProtocol, {
				scope: 'EvmProtocol',
			}).$$evmErrors({
				sources: [
					Source.Openchain_Rest,
				],
				count: true,
			})
		}
		id='evm-errors'
	/>
</Page>
