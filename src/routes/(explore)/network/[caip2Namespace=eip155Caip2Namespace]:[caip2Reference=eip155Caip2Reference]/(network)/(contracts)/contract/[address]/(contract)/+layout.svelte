<script lang="ts">
	// Types/constants
	import { networkIdFromCaip2RouteParams } from '$/lib/caip.ts'


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
	title={'Contract'}
	href={resolve('/(explore)/network/[caip2Namespace]:[caip2Reference]/(network)/(contracts)/contract/[address]', params)}
	id={stringify(networkIdFromCaip2RouteParams(params))}
>
	{@render children()}
</ParentPageCollapsible>
