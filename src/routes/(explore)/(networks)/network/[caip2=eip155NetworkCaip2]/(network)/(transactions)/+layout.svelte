<script lang="ts">
	import { eip155NetworkSelectorFromCaip2 } from '$/lib/caip2.ts'
	// Types/constants
	import type { Snippet } from 'svelte'
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children: PageChildren,
		params,
	}: {
		children: Snippet
		params: {
			caip2: `eip155:${string}`
			transactionId?: string
		}
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="Blocks"
	href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', params)}
	id={stringify({ ...eip155NetworkSelectorFromCaip2(params.caip2), scope: 'blocks' })}
>
	<ParentPageCollapsible
		title="Transactions"
		href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/transactions', params)}
		id={stringify({ ...eip155NetworkSelectorFromCaip2(params.caip2), scope: 'transactions' })}
	>
		{@render PageChildren()}
	</ParentPageCollapsible>
</ParentPageCollapsible>
