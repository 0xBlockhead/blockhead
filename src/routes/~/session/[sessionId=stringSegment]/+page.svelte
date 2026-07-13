<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.BlockheadSession, {
		id: params.sessionId,
	}, {
		sources: [
			Source.Local_Internal,
		],
		fields: {
			name: true,
			status: true,
			updatedAt: true,
			createdAt: true,
			lockedAt: true,
			$latestSimulation: true,
			simulationCount: true,
		},
	}))
	const pageEntityTitle = $derived((pageSelection.entity == null ? [String((pageSelection.entitySelector.name) ?? '')].filter(Boolean).join(' ') || [String((pageSelection.entitySelector.id) ?? '')].filter(Boolean).join(' ') || 'session' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).id) ?? '')].filter(Boolean).join(' ') || 'session'))


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionView
		href={
			resolve('/~/session/[sessionId=stringSegment]', {
				sessionId: params.sessionId,
			})
		}
		selection={pageSelection}
	/>
</Page>
