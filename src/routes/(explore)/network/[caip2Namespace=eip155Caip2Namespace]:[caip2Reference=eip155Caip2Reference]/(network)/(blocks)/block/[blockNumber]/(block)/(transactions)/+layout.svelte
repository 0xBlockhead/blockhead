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
	title={'Transactions'}
	href={resolve(
		`/network//block/${params.blockNumber}/transactions`,
	)}
	id={stringify({
		$network: networkIdFromCaip2RouteParams(params),
		blockNumber: BigInt(params.blockNumber),
		scope: 'transactions',
	})}
>
	{@render children()}
</ParentPageCollapsible>
