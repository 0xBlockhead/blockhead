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

	const pageSelection = $derived(select(EntityType.FilecoinActor, data.selector, {
		sources: [
			Source.Lotus_JsonRpc,
			Source.Filfox_Rest,
		],
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import FilecoinActorView from '$/views/FilecoinActorView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? (pageSelection.entitySelector.address || 'filecoin actor')} • filecoin actor • Blockhead</title>
</svelte:head>


<Page>
	<FilecoinActorView
		selection={pageSelection}
	/>
</Page>
