<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title={'Users'}
	href={resolve('/farcaster/users')}
>
	{@render children()}
</ParentPageCollapsible>
