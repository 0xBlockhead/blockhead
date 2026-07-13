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


	// Components
	import Page from '$/components/Page.svelte'
	import EnsRecordsView from '$/views/EnsRecordsView.svelte'
</script>


<svelte:head>
	<title>ENS records • Blockhead</title>
</svelte:head>


<Page>
	<EnsRecordsView
		href={
			resolve('/ens/name/[ensName=stringSegment]/records', {
				ensName: params.ensName,
			})
		}
		title='ENS records'
		selection={
			select(EntityType.EnsName, {
				name: decodeURIComponent(params.ensName),
			}).$$records({
				sources: [
					Source.TheGraph_Graphql,
					Source.Voltaire_JsonRpc,
				],
			})
		}
		id='records'
	/>
</Page>
