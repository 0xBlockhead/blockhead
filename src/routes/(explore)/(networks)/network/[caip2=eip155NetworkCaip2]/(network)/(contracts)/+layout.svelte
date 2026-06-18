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
	title={'Contracts'}
	href={resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/contracts', params)}
	id={stringify(eip155NetworkSelectorFromCaip2(params.caip2))}
>
	{@render children()}
</ParentPageCollapsible>
