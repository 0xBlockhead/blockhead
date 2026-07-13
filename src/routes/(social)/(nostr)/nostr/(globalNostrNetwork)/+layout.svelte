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
	import GlobalNostrNetworkView from '$/views/_GlobalNostrNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/nostr')}
>
	{#snippet Summary()}
		{@const DetailView = GlobalNostrNetworkView}

		<DetailView
			selection={select(EntityType._GlobalNostrNetwork, data.selector)}
			href={resolve('/nostr')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
