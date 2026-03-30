<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'
	import type { LayoutProps } from './$types'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Transactions'}
	href={resolve(
		`/network/${params.networkId}/block/${params.blockNumber}/transactions`,
	)}
	id={stringify({
		$network: { chainId: Number(params.networkId) },
		blockNumber: BigInt(params.blockNumber),
		scope: 'transactions',
	})}
>
	{@render children()}
</ParentPageCollapsible>
