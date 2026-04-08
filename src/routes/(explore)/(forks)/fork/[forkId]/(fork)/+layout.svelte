<script lang="ts">
	// Types/constants
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
	title={'Fork'}
	href={resolve('/(explore)/(forks)/fork/[forkId]', params)}
	id={params.forkId}
>
	{@render children()}
</ParentPageCollapsible>
