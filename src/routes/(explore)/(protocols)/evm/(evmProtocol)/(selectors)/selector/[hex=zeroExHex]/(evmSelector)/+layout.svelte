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
	import EvmSelectorView from '$/views/EvmSelectorView.svelte'
</script>


{#key params.hex}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
				{
					hex: String(params.hex),
				}
			)
		}
	>
		{#snippet Summary()}
			<EvmSelectorView
				selection={
					select(EntityType.EvmSelector, data.selector, { sources: [
						Source.Openchain_Rest,
					] })
				}
				href={
					resolve(
						'/(explore)/(protocols)/evm/(evmProtocol)/(selectors)/selector/[hex=zeroExHex]',
						{
							hex: String(params.hex),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
