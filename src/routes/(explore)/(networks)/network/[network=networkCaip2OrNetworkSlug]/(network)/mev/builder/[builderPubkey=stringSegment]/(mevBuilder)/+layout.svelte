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
	import MevBuilderView from '$/views/MevBuilderView.svelte'
</script>


{#key [params.network, params.builderPubkey].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
				network: params.network,
				builderPubkey: params.builderPubkey,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = MevBuilderView}

			<DetailView
				selection={select(EntityType.MevBuilder, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/mev/builder/[builderPubkey=stringSegment]', {
						network: params.network,
						builderPubkey: params.builderPubkey,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
