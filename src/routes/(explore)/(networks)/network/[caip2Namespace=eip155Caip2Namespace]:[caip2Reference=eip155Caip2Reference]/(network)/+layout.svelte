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


{#key `${params.caip2Namespace}:${params.caip2Reference}`}
	<ParentPageCollapsible
		href={resolve('/(explore)/(networks)/network/[caip2Namespace=eip155Caip2Namespace]:[caip2Reference=eip155Caip2Reference]', params)}
		id={stringify({ caip2: { namespace: params.caip2Namespace, reference: params.caip2Reference } })}
	>
		{#snippet Summary({ open: _open })}
			<EvmNetworkView
				entityId={{
					caip2: {
						namespace: 'eip155',
						reference: params.caip2Reference,
					},
				}}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
