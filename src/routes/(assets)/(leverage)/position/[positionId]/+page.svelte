<script lang="ts">
	import { EntityType } from '$/schema/EntityType.ts'
	import { select } from '$/routes/+layout.svelte'
	// State
	let {
		params,
	} = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import LeverageView from '$/views/LeverageView.svelte'
</script>


<Page>
	<LeverageView
		selection={select(EntityType.Leverage, {
			$network: { caip2: { namespace: 'eip155' as const, reference: String(1) } },
			id: params.positionId,
		})}
	/>
</Page>
