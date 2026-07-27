<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
	import { EntityType } from '$/schema/EntityType.ts'
	import { Source } from '$/sources/Source.ts'


	// Context
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()
	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecordsView from '$/views/EnsRecordsView.svelte'
</script>


<svelte:head>
	<title>ENS records • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.EnsName, {
		name: decodeURIComponent(params.ensName),
	})
		.$$records({
			sources: [
				Source.TheGraph_Graphql,
				Source.Voltaire_JsonRpc,
			],
		})}

	<EnsRecordsView
		href={
			resolve(
				'/(explore)/(ens)/ens/(globalEnsNetwork)/name/[ensName=stringSegment]/(ensName)/records',
				{
					ensName: String(params.ensName),
				}
			)
		}
		title='ENS records'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='records'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
