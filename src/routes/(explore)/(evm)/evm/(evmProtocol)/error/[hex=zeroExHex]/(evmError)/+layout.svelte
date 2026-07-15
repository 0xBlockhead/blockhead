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
	import EvmErrorView from '$/views/EvmErrorView.svelte'
</script>


{#key params.hex}
	<ParentPageCollapsible
		href={
			resolve('/evm/error/[hex=zeroExHex]', {
				hex: params.hex,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = EvmErrorView}

			<DetailView
				selection={select(EntityType.EvmError, data.selector)}
				href={
					resolve('/evm/error/[hex=zeroExHex]', {
						hex: params.hex,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
