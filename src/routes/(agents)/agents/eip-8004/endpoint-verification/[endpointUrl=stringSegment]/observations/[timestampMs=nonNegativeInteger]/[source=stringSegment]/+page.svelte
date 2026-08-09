<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.Eip8004EndpointDomainVerification_Timestamp, {
		endpointUrl: params.endpointUrl,
		timestampMs: Number(params.timestampMs),
		source: params.source,
	}, {
		sources: [params.source],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import Eip8004EndpointDomainVerification_TimestampView from '$/views/Eip8004EndpointDomainVerification_TimestampView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entitySelector.endpointUrl || 'EIP-8004 endpoint domain verification timestamp'} • EIP-8004 endpoint domain verification timestamp • Blockhead</title>
</svelte:head>


<Page>
	<Eip8004EndpointDomainVerification_TimestampView
		selection={pageSelection}
	/>
</Page>
