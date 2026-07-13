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
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


{#key params.address}
	<ParentPageCollapsible
		href={
			resolve('/lens/account/[address=evmAddress]', {
				address: params.address,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = LensAccountView}

			<DetailView
				selection={select(EntityType.LensAccount, data.selector)}
				href={
					resolve('/lens/account/[address=evmAddress]', {
						address: params.address,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
