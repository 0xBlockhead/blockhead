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
	import GlobalYoutubeNetworkView from '$/views/_GlobalYoutubeNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/youtube')}
>
	{#snippet Summary()}
		{@const DetailView = GlobalYoutubeNetworkView}

		<DetailView
			selection={select(EntityType._GlobalYoutubeNetwork, data.selector, { sources: [
	Source.Constants_Internal,
] })}
			href={resolve('/youtube')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
