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
		resolve('/network/[network=networkCaip2OrNetworkSlug]/blocks', {
			network: params.network,
		})
	}
>
	{@render children()}
</ParentPageCollapsible>
