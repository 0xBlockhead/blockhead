<script lang="ts">
	// Types/constants
	import { resolve } from '$app/paths'
	import { page } from '$app/state'


	// State
	let {
		children,
	} = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title="ENS"
	href={resolve(`/ens/name/${page.params.ensName}`)}
	id={page.params.ensName}
>
	{@render children()}
</ParentPageCollapsible>
