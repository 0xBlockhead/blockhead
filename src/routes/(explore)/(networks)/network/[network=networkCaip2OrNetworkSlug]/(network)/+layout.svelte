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
			{@const DetailView = data.selectorMapping.entityType === EntityType.Network && data.selectorMapping.selectorName === 'Caip2' ? NetworkView : NetworkView}

			<DetailView
				selection={select(data.selectorMapping.entityType, data.selectorMapping.selector, { sources: [
		Source.Constants_Internal,
	] })}
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
