<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(data?.selector == null ? undefined : select(EntityType.MoneroRingMember, {
		$ring: data.selector,
		memberIndex: Number(params.memberIndex),
	}, {
		sources: [
			Source.MoneroDaemonRpc_JsonRpc,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import MoneroRingMemberView from '$/views/MoneroRingMemberView.svelte'
</script>


<svelte:head>
	{#if pageSelection != null}
		<title>{data?.title ?? (String(pageSelection.entitySelector.memberIndex) || 'monero ring member')} • monero ring member • Blockhead</title>
	{:else}
		<title>{data?.title ?? 'monero ring member'} • monero ring member • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if pageSelection != null}
	<MoneroRingMemberView
		selection={pageSelection}
	/>
	{/if}
</Page>
