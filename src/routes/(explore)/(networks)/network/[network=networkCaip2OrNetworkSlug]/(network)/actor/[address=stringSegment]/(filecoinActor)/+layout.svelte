<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { LayoutProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


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
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


{#key [params.network, params.address].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
				network: params.network,
				address: params.address,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = FilecoinActorView}

			<DetailView
				selection={select(EntityType.FilecoinActor, data.selector, { sources: [
		Source.Lotus_JsonRpc,
	] })}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/actor/[address=stringSegment]', {
						network: params.network,
						address: params.address,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
