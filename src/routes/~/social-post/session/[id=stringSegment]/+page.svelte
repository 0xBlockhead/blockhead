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
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSocialPostSession, {
		id: params.id,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSocialPostSessionView from '$/views/BlockheadSocialPostSessionView.svelte'
</script>


<svelte:head>
	<title>{pageSelection.entity == null ? (pageSelection.entitySelector.id ?? '') || 'blockhead social post session' : (pageSelection.entity.name ?? '') || pageSelection.entitySelector.id || 'blockhead social post session'} • blockhead social post session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSocialPostSessionView
		selection={pageSelection}
	/>
</Page>
