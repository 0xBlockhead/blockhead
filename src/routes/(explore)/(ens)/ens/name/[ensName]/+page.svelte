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
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<Page>
	<EnsNameView
		href={
			resolve('/(explore)/(ens)/ens/name/[ensName]', {
				ensName: params.ensName,
			})
		}
		selection={
			select(EntityType.EnsName, {
				name: decodeURIComponent(params.ensName),
			}, {
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
			})
		}
	/>
</Page>
