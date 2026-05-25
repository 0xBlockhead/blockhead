<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'ENS'}
	href={resolve('/ens')}
	id={'ens'}
>
	{@render children()}
</ParentPageCollapsible>
