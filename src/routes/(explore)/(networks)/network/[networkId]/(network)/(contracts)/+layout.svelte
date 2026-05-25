<script lang="ts">
	// Types/constants
	import { stringify } from 'devalue'


	// Context
	import { resolve } from '$app/paths'


	// Props
	let {
		children,
		params,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Contracts'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/contracts', params)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
