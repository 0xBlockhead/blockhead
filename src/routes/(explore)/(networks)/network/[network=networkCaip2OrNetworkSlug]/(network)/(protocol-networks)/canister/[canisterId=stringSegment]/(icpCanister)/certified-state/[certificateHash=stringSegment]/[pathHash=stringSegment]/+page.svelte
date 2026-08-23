<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import IcpCertifiedStateView from '$/views/IcpCertifiedStateView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCertifiedState, {
				$canister: data.selector,
				certificateHash: params.certificateHash,
				pathHash: params.pathHash,
			})}
		<title>{data?.title ?? 'ICP certified state'} • ICP certified state • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'ICP certified state'} • ICP certified state • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{@const pageSelection = select(EntityType.IcpCertifiedState, {
				$canister: data.selector,
				certificateHash: params.certificateHash,
				pathHash: params.pathHash,
			})}

	<IcpCertifiedStateView
		selection={pageSelection}
	/>
	{/if}
</Page>
