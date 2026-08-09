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
			'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/~/quilibrium/connection/[connectionId=stringSegment]/account-state/[accountAddress=stringSegment]',
			{
				network: params.network,
				connectionId: params.connectionId,
				accountAddress: params.accountAddress,
			}
		)
	)


	// Components
	import { EntityLayout } from '$/components/EntityView.svelte'
	import ParentPageCollapsible from '$/components/ParentPageCollapsible.svelte'
	import BlockheadQuilibriumAccountStateView from '$/views/BlockheadQuilibriumAccountStateView.svelte'
</script>


<ParentPageCollapsible
	href={detailHref}
>
	{#snippet Summary()}
		<BlockheadQuilibriumAccountStateView
			selection={
				select(EntityType.BlockheadQuilibriumAccountState, data.selector, {
					sources: [
						Source.Local_Internal,
						Source.QuilibriumNodeRpc_Grpc,
					],
				})
			}
			href={detailHref}
			layout={EntityLayout.SummaryInline}
		/>
	{/snippet}

	{@render children()}
</ParentPageCollapsible>
