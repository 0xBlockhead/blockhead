<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


{#key params.caip2}
	<ParentPageCollapsible
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
				caip2: params.caip2,
			})
		}
	>
		{#snippet Summary()}
			<NetworkView
				selection={
					select(EntityType.Network, {
						caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
					})
				}
				href={
					resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]', {
						caip2: params.caip2,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
