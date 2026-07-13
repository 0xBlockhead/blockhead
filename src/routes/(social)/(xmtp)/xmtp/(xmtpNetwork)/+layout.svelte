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
	import XmtpNetworkView from '$/views/XmtpNetworkView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/xmtp')}
>
	{#snippet Summary()}
		{@const DetailView = XmtpNetworkView}

		<DetailView
			selection={select(EntityType.XmtpNetwork, data.selector)}
			href={resolve('/xmtp')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
