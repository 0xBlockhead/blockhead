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
	import GlobalRedditNetworkView from '$/views/_GlobalRedditNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/reddit')}
>
	{#snippet Summary()}
		{@const DetailView = GlobalRedditNetworkView}

		<DetailView
			selection={select(EntityType._GlobalRedditNetwork, data.selector, { sources: [
	Source.Constants_Internal,
	Source.Reddit_PublicJson,
] })}
			href={resolve('/reddit')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
