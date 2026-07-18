<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Context
	import { resolve } from '$app/paths'


	// State
	let { children } = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title='Topics'
	href={resolve('/evm/topics')}
>
	{@render children()}
</ParentPageCollapsible>
