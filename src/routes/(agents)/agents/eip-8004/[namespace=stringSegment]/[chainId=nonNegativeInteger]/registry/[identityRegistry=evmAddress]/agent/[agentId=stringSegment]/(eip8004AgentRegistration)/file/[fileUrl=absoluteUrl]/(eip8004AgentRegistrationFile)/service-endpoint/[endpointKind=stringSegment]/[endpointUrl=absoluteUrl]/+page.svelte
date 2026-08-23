<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'
	import { untrack } from 'svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004AgentServiceEndpointView from '$/views/Eip8004AgentServiceEndpointView.svelte'
</script>


<svelte:head>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004AgentServiceEndpoint, {
					$registrationFile: data.selector,
					endpointKind: params.endpointKind,
					endpointUrl: decodeURIComponent(params.endpointUrl),
				}, {
					sources: [
						Source.Eip8004Scan_Rest,
					],
				}))}
			<title>{data?.title ?? (pageSelection.entitySelector.endpointUrl || 'EIP-8004 agent service endpoint')} • EIP-8004 agent service endpoint • Blockhead</title>
		{/key}
	{:else}
		<title>{data?.title ?? 'EIP-8004 agent service endpoint'} • EIP-8004 agent service endpoint • Blockhead</title>
	{/if}
</svelte:head>


<Page>
	{#if data?.selector != null}
		{#key data.selector}
			{@const pageSelection = untrack(() => select(EntityType.Eip8004AgentServiceEndpoint, {
					$registrationFile: data.selector,
					endpointKind: params.endpointKind,
					endpointUrl: decodeURIComponent(params.endpointUrl),
				}, {
					sources: [
						Source.Eip8004Scan_Rest,
					],
				}))}

		<Eip8004AgentServiceEndpointView
			selection={pageSelection}
		/>
		{/key}
	{/if}
</Page>
