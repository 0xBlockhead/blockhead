<script lang="ts">
	// Types/constants
	import { evmChainIdFromCaip2RouteParams } from '$/lib/caip.ts'


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
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Blocks'}
	href={resolve('/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/blocks', params)}
	id={stringify({ chainId: evmChainIdFromCaip2RouteParams(params) })}
>
	{@render children()}
</ParentPageCollapsible>
