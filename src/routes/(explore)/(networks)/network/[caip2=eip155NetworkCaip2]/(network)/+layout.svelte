<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	} = $props()


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
				selector={eip155NetworkSelectorFromCaip2(params.caip2)}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
