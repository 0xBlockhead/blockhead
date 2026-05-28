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

	import {
		caip2FromRouteParams,
		evmChainIdFromCaip2RouteParams,
	} from '$/lib/caip.ts'

	const chainId = $derived(
		evmChainIdFromCaip2RouteParams(params),
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import EvmNetworkView from '$/views/EvmNetworkView.svelte'
</script>


{#key caip2FromRouteParams(params)}
	<ParentPageCollapsible
		href={resolve('/(explore)/network/[caip2Namespace]:[caip2Reference]', params)}
		id={stringify({ chainId })}
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
