<script lang="ts">
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
		id={stringify({ caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } })}
	>
		{#snippet Summary({ open: _open })}
			<EvmNetworkView
				selector={{
					caip2: {
						namespace: 'eip155',
						reference: params.caip2.slice('eip155:'.length),
					},
				}}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
