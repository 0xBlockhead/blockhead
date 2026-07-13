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
	import CurrencyView from '$/views/CurrencyView.svelte'
</script>


{#key params.iso4217}
	<ParentPageCollapsible
		href={
			resolve('/currency/[iso4217=iso4217]', {
				iso4217: params.iso4217,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = CurrencyView}

			<DetailView
				selection={select(EntityType.Currency, data.selector)}
				href={
					resolve('/currency/[iso4217=iso4217]', {
						iso4217: params.iso4217,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
