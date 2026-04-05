<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import type { LayoutProps } from './$types'


	// State
	let {
		children,
	}: LayoutProps = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="Proposals"
	href={resolve('/proposals')}
>
	{@render children()}
</ParentPageCollapsible>
