<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()


	// Components
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
</script>


<ParentPageCollapsible
	title='Blocks'
	href={
		resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/blocks', {
			caip2: params.caip2,
		})
	}
>
	{@render children()}
</ParentPageCollapsible>
