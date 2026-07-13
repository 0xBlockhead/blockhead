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
	import EvmCalldataView from '$/views/EvmCalldataView.svelte'
</script>


<ParentPageCollapsible
	href={resolve('/evm/calldata')}
>
	{#snippet Summary()}
		{@const DetailView = EvmCalldataView}

		<DetailView
			selection={select(EntityType.EvmCalldata, data.selector)}
			href={resolve('/evm/calldata')}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
