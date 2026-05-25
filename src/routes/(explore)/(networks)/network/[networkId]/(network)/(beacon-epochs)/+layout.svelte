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
	title={'Epochs'}
	href={resolve('/(explore)/(networks)/network/[networkId]/(network)/beacon-epochs', params)}
	id={stringify({ chainId: Number(params.networkId) })}
>
	{@render children()}
</ParentPageCollapsible>
