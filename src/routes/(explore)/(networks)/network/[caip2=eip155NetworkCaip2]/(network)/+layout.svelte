<script lang="ts">
	// Types/constants
	import { EntityType } from '$/schema/EntityType.ts'
	import { stringify } from 'devalue'
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


	// Functions
	import { select } from '$/routes/+layout.svelte'


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


{#key params.caip2}
	<ParentPageCollapsible
		href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', params)}
		id={stringify(eip155NetworkSelectorFromCaip2(params.caip2))}
	>
		{#snippet Summary({ open: _open })}
			<EvmNetworkView
				selection={
					select(
						EntityType.EvmNetwork,
						eip155NetworkSelectorFromCaip2(params.caip2)
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
