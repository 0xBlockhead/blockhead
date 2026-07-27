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
	import LensAccountView from '$/views/LensAccountView.svelte'
</script>


{#key params.address}
	<ParentPageCollapsible
		href={
			resolve(
				'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
				{
					address: String(params.address),
				}
			)
		}
	>
		{#snippet Summary()}
			<LensAccountView
				selection={
					select(EntityType.LensAccount, data.selector, { sources: [
						Source.Lens_Graphql,
					] })
				}
				href={
					resolve(
						'/(social)/(lens)/lens/(lensNetwork)/account/[address=evmAddress]',
						{
							address: String(params.address),
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
