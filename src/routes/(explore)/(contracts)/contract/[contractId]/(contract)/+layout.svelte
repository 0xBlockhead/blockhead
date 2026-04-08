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
	title={'Contract'}
	href={resolve('/(explore)/(contracts)/contract/[contractId]', params)}
	id={params.contractId}
>
	{@render children()}
</ParentPageCollapsible>
