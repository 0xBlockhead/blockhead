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
	import EnsNameView from '$/views/EnsNameView.svelte'
</script>


<svelte:head>
	<title>ENS resolver • Blockhead</title>
</svelte:head>


<Page>
	<EnsNameView
		href={
			resolve('/(explore)/(ens)/ens/name/[ensName]/(ensName)/resolver', {
				ensName: params.ensName,
			})
		}
		selection={
			select(EntityType.EnsName, data.selector, {
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
