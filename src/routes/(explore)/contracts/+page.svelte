<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { resolve } from '$app/paths'


	// Components
	import Page from '$/components/Page.svelte'
	import EvmContractsView from '$/views/EvmContractsView.svelte'
</script>


<Page>
	<EvmContractsView
		href={resolve(
			'/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts',
			{
				caip2: `eip155:`,
			}
		)}
		selection={select(
			EntityType.EvmNetwork,
			{
				caip2: {
					namespace: 'eip155',
					reference: String(1),
				},
			}
		).$$contracts({
			sources: [
				Source.Blockscout_Rest,
			],
			limit: 16,
		})}
		id="contracts"
	/>
</Page>
