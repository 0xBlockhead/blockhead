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
	import CoinView from '$/views/CoinView.svelte'
</script>


{#key params.coinId}
	<ParentPageCollapsible
		href={
			resolve(
				'/(assets)/coin/[coinId=stringSegment]',
				{
					coinId: params.coinId,
				}
			)
		}
	>
		{#snippet Summary()}
			<CoinView
				selection={
					select(EntityType.Coin, data.selector, { sources: [
						Source.Constants_Internal,
					] })
				}
				href={
					resolve(
						'/(assets)/coin/[coinId=stringSegment]',
						{
							coinId: params.coinId,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
