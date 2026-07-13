<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		children,
		data,
		params,
	}: LayoutProps = $props()


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import NetworkView from '$/views/NetworkView.svelte'
</script>


{#key params.network}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]', {
				network: params.network,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = NetworkView}

			<DetailView
				selection={select(EntityType.Network, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]', {
						network: params.network,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
