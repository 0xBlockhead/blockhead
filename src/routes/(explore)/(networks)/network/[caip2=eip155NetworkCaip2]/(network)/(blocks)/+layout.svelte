<script lang="ts">
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
	href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', params)}
	id={stringify({ caip2: { namespace: 'eip155', reference: params.caip2.slice('eip155:'.length) } })}
>
	{@render children()}
</ParentPageCollapsible>
