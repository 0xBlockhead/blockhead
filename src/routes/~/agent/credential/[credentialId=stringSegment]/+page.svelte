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
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentCredentialState, data.selector, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentCredentialStateView from '$/views/BlockheadAgentCredentialStateView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? (pageSelection.entity == null ? (pageSelection.entitySelector.credentialId ?? '') || 'blockhead agent credential state' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.credentialId || 'blockhead agent credential state')} • blockhead agent credential state • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentCredentialStateView
		selection={pageSelection}
	/>
</Page>
