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
	import CardanoStakeDelegation_EpochView from '$/views/CardanoStakeDelegation_EpochView.svelte'
</script>


<svelte:head>
	<title>{data.title ?? 'Cardano stake delegation epoch'} • Cardano stake delegation epoch • Blockhead</title>
</svelte:head>


<Page>
	<CardanoStakeDelegation_EpochView
		selection={
			select(EntityType.CardanoStakeDelegation_Epoch, {
				$stakeCredential: data.selector,
				epoch: Number(params.epoch),
				source: params.source,
			}, {
				sources: [params.source],
			})
		}
	/>
</Page>
