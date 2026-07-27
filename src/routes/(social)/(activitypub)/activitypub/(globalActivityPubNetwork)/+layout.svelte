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
	import GlobalActivityPubNetworkView from '$/views/_GlobalActivityPubNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/(social)/(activitypub)/activitypub')}
>
	{#snippet Summary()}
		<GlobalActivityPubNetworkView
			selection={
				select(EntityType._GlobalActivityPubNetwork, data.selector, { sources: [
					Source.Constants_Internal,
					Source.Mastodon_Rest,
				] })
			}
			href={resolve('/(social)/(activitypub)/activitypub')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
