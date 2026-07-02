<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import { EntityProxyField } from '$/client/$proxy.svelte.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<svelte:head>
	<title>Contracts • Blockhead</title>
</svelte:head>


<Page>
	<EvmContractsView
		href={resolve('/(explore)/contracts')}
		title='Contracts'
		selection={
			select(EntityType.EvmNetwork, {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			})[EntityProxyField]<EntityType.EvmContract>('$$contracts', {
				sources: [
					Source.Blockscout_Rest,
				],
				limit: 16,
			})
		}
		id='EvmContractsView-page'
	/>
</Page>
