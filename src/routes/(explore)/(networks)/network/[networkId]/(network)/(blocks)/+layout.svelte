<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { stringify } from 'devalue'


	// Props
	let {
		children,
		params,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Blocks'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/blocks', params)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
