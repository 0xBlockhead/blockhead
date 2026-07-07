<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { caip2SelectorValueFromString } from '$/lib/caip2.ts'
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
	import EthereumConsensusUpgradeView from '$/views/EthereumConsensusUpgradeView.svelte'
</script>


<Page>
	<EthereumConsensusUpgradeView
		href={
			resolve('/(explore)/(networks)/network/[caip2=eip155NetworkCaip2]/(network)/(upgrades)/consensus/[upgradeSlug]', {
				caip2: params.caip2,
				upgradeSlug: params.upgradeSlug,
			})
		}
		selection={
			select(EntityType.EthereumConsensusUpgrade, {
				$network: {
					caip2: caip2SelectorValueFromString(decodeURIComponent(params.caip2)),
				},
				slug: params.upgradeSlug,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					name: true,
					protocol: true,
					activationBlock: true,
					activationEpoch: true,
					activationTimestampMs: true,
					previousForkVersion: true,
					currentForkVersion: true,
				},
			})
		}
	/>
</Page>
