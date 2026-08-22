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
	import AlgorandApplicationLocalState_RoundView from '$/views/AlgorandApplicationLocalState_RoundView.svelte'
</script>


<svelte:head>
	<title>{data?.title ?? 'algorand application local state round'} • algorand application local state round • Blockhead</title>
</svelte:head>


<Page>
	<AlgorandApplicationLocalState_RoundView
		selection={
			select(EntityType.AlgorandApplicationLocalState_Round, {
				$account: data.selector,
				$application: {
					$network: {
						$network: {
							caip2: params.applicationNetwork,
						},
					},
					applicationId: BigInt(params.applicationId),
				},
				round: BigInt(params.round),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
