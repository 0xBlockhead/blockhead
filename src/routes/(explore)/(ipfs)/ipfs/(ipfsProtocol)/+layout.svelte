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
	import IpfsProtocolView from '$/views/IpfsProtocolView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/ipfs')}
>
	{#snippet Summary()}
		{@const DetailView = IpfsProtocolView}

		<DetailView
			selection={select(EntityType.IpfsProtocol, data.selector, { sources: [
	Source.Constants_Internal,
] })}
			href={resolve('/ipfs')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
