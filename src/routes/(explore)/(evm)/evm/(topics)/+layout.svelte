<script lang="ts">
	// Types/constants
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import { resolve } from '$app/paths'


	// Props
	let { children } = $props()
</script>


<ParentPageCollapsible
	title={'Topics'}
	href={resolve('/evm/topics')}
	id={'evm-topics'}
>
	{@render children()}
</ParentPageCollapsible>
