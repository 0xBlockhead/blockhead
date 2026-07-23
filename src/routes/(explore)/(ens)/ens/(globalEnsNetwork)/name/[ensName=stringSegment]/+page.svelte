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
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.EnsName, data.selector, {
		sources: [
			Source.TheGraph_Graphql,
			Source.Voltaire_JsonRpc,
		],
		fields: {
			normalizedName: true,
			node: true,
			labelName: true,
			labelhash: true,
			$parent: true,
			$resolverContract: true,
			$subgraphResolvedActor: true,
			$ownerActor: true,
		},
	}))


	// Components
	import Page from '$/components/Page.svelte'
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	<title>{(data.title ?? (pageSelection.entity == null ? [String((data.selector.name) ?? '')].filter(Boolean).join(' ') || 'ENS name' : [String((({ ...data.selector, ...pageSelection.entity }).name) ?? '')].filter(Boolean).join(' ') || 'ENS name'))} • ENS name • Blockhead</title>
</svelte:head>


<Page>
	<EnsNameView
		href={
			resolve('/ens/name/[ensName=stringSegment]', {
				ensName: params.ensName,
			})
		}
		selection={pageSelection}
	/>
</Page>
