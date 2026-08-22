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

	const pageSelection = $derived(select(EntityType.SwarmResource, data.selector, {
		sources: [
			Source.Swarm_Rest,
		],
		fields: {
			canonicalUri: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import SwarmResourceView from '$/views/SwarmResourceView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entity == null ? 'Swarm resource' : pageSelection.entity.canonicalUri || 'Swarm resource')} • Swarm resource • Blockhead</title>
</svelte:head>


<Page>
	<SwarmResourceView
		selection={pageSelection}
	/>
</Page>
