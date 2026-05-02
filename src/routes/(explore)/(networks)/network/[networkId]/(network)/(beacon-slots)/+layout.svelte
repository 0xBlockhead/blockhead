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
	title={'Slots'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-slots', params)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
