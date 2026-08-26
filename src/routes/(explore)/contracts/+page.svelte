<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


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
			select(EntityType.Network, {
				caip2: {
					namespace: 'eip155',
					reference: '1',
				},
			}).Evm
				.$$contracts({
					sources: [
						Source.Blockscout_Rest,
					],
					limit: 16,
				})
		}
		id='contracts'
	/>
</Page>
