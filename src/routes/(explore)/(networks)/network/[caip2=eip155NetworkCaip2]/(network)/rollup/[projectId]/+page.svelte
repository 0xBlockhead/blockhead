<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		params,
	}: PageProps = $props()


	// Components
	import Page from '$/components/Page.svelte'
	import EvmRollupView from '$/views/EvmRollupView.svelte'
</script>


<Page>
	<EvmRollupView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/rollup/[projectId]', {
				caip2: params.caip2,
				projectId: params.projectId,
			})
		}
		selection={
			select(EntityType.EvmRollup, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				projectId: decodeURIComponent(params.projectId),
			}, {
				fields: {
					name: true,
					type: true,
					category: true,
					hostChain: true,
					$settlementNetwork: true,
				},
			})
		}
	/>
</Page>
