<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'ENS'}
	href={resolve('/ens')}
	id={'ens'}
>
	{@render children()}
</ParentPageCollapsible>
