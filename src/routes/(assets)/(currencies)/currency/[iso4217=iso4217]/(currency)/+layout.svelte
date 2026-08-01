<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(assets)/(currencies)/currency/[iso4217=iso4217]',
			{
				iso4217: params.iso4217,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


{#key params.iso4217}
	<ParentPageCollapsible
		href={detailHref}
	>
		{#snippet Summary()}
			<CurrencyView
				selection={
					select(EntityType.Currency, data.selector, {
						sources: [
							Source.Constants_Internal,
						],
					})
				}
				href={detailHref}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
