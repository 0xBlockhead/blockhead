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
	import MevRelayView from '$/views/MevRelayView.svelte'
</script>


{#key [params.network, params.host].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
				network: params.network,
				host: params.host,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = MevRelayView}

			<DetailView
				selection={select(EntityType.MevRelay, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/relay/[host=stringSegment]', {
						network: params.network,
						host: params.host,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
