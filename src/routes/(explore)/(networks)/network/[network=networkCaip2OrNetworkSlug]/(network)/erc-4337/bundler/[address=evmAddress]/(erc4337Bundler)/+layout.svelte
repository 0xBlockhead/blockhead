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
	import Erc4337BundlerView from '$/views/Erc4337BundlerView.svelte'
</script>


{#key [params.network, params.address].join(':')}
	<ParentPageCollapsible
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
				{
					network: params.network,
					address: params.address,
				}
			)
		}
	>
		{#snippet Summary()}
			<Erc4337BundlerView
				selection={select(EntityType.Erc4337Bundler, data.selector)}
				href={
					resolve(
						'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/bundler/[address=evmAddress]',
						{
							network: params.network,
							address: params.address,
						}
					)
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
