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
	title='Upgrades'
	href={
		resolve('/network/[network=networkCaip2OrNetworkSlug]/upgrades', {
			network: params.network,
		})
	}
>
	{@render children()}
</ParentPageCollapsible>
