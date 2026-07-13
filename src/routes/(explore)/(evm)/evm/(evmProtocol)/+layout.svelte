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
	import EvmProtocolView from '$/views/EvmProtocolView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/evm')}
>
	{#snippet Summary()}
		{@const DetailView = EvmProtocolView}

		<DetailView
			selection={select(EntityType.EvmProtocol, data.selector)}
			href={resolve('/evm')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
