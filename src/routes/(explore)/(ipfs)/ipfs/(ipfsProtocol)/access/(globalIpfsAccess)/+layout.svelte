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
	import GlobalIpfsAccessView from '$/views/_GlobalIpfsAccessView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/ipfs/access')}
>
	{#snippet Summary()}
		{@const DetailView = GlobalIpfsAccessView}

		<DetailView
			selection={select(EntityType._GlobalIpfsAccess, data.selector, { sources: [
	Source.Constants_Internal,
] })}
			href={resolve('/ipfs/access')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
