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
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Transactions'}
	href={resolve(
		`/network//block/${params.blockNumber}/transactions`,
	)}
	id={stringify({
		$network: eip155NetworkSelectorFromCaip2(params.caip2),
		blockNumber: BigInt(params.blockNumber),
		scope: 'transactions',
	})}
>
	{@render children()}
</ParentPageCollapsible>
