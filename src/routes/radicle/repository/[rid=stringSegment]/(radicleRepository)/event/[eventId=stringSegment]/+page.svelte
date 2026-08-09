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
	import RadicleCollaborationEventView from '$/views/RadicleCollaborationEventView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'radicle collaboration event'} • radicle collaboration event • Blockhead</title>
</svelte:head>


<Page>
	<RadicleCollaborationEventView
		selection={
			select(EntityType.RadicleCollaborationEvent, {
				$repository: data.selector,
				eventId: params.eventId,
			})
		}
	/>
</Page>
