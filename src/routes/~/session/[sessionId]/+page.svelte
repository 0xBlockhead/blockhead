<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import BlockheadSessionView from '$/views/BlockheadSessionView.svelte'
</script>


<svelte:head>
	<title>session • Blockhead</title>
</svelte:head>


<Page>
	<BlockheadSessionView
		href={
			resolve('/~/session/[sessionId]', {
				sessionId: params.sessionId,
			})
		}
		selection={
			select(EntityType.BlockheadSession, data.selector, {
				fields: {
					name: true,
					status: true,
					updatedAt: true,
					createdAt: true,
					lockedAt: true,
					$latestSimulation: true,
					simulationCount: true,
				},
			})
		}
	/>
</Page>
