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
	title={'Agent'}
	href={resolve('/(explore)/(agents)/agent/[agentId]', params)}
	id={params.agentId}
>
	{@render children()}
</ParentPageCollapsible>
