<script lang="ts">
	// Context
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// State
	let {
		children,
		params,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Block'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/(blocks)/block/[blockNumber]', params)}
	id={stringify({
		$network: { chainId: Number(params.networkId) },
		blockNumber: BigInt(params.blockNumber),
	})}
>
	{@render children()}
</ParentPageCollapsible>
