<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { getAppClient } from '$/routes/applicationClient.ts'
	const select = getAppClient().select


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadAgentProfile, {
		profileId: params.profileId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			label: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadAgentProfileView from '$/views/BlockheadAgentProfileView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.profileId ?? '') || 'blockhead agent profile' : (pageSelection.entity.label ?? '') || pageSelection.entitySelector.profileId || 'blockhead agent profile'} • blockhead agent profile • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadAgentProfileView
		selection={pageSelection}
	/>
</Page>
