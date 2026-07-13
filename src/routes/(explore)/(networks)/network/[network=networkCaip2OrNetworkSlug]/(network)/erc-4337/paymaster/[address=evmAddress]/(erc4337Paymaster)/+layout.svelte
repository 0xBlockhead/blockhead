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
	import Erc4337PaymasterView from '$/views/Erc4337PaymasterView.svelte'
</script>


{#key [params.network, params.address].join(':')}
	<ParentPageCollapsible
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
				network: params.network,
				address: params.address,
			})
		}
	>
		{#snippet Summary()}
			{@const DetailView = Erc4337PaymasterView}

			<DetailView
				selection={select(EntityType.Erc4337Paymaster, data.selector)}
				href={
					resolve('/network/[network=networkCaip2OrNetworkSlug]/erc-4337/paymaster/[address=evmAddress]', {
						network: params.network,
						address: params.address,
					})
				}
				layout={EntityLayout.SummaryInline}
			/>
		{/snippet}

		{@render children()}
	</ParentPageCollapsible>
{/key}
