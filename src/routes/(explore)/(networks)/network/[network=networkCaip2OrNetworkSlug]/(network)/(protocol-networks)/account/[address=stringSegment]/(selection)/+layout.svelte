<!-- Generated from APP.ts. -->

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

	const detailHref = $derived(
		resolve(
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/(protocol-networks)/account/[address=stringSegment]',
			{
				network: params.network,
				address: params.address,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import SuiAccountView from '$/views/SuiAccountView.svelte'
	import TezosAccountView from '$/views/TezosAccountView.svelte'
	import KaspaAddressView from '$/views/KaspaAddressView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		{@const DetailView = data.entityType === EntityType.SuiAccount ? SuiAccountView : data.entityType === EntityType.TezosAccount ? TezosAccountView : KaspaAddressView}

		<DetailView
			selection={select(data.entityType, data.selector)}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
