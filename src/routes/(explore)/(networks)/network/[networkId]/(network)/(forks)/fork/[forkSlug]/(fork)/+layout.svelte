<script lang="ts">
	// Types/constants
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
	title={'Fork'}
	href={resolve(
		'/(explore)/(networks)/network/[networkId]/(network)/(forks)/fork/[forkSlug]',
		{ networkId: params.networkId, forkSlug: params.forkSlug },
	)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
