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
	import SolanaNetwork_TimestampView from '$/views/SolanaNetwork_TimestampView.svelte'
</script>


<svelte:head>
	<title>solana network timestamp • Blockhead</title>
</svelte:head>


<Page>
	<SolanaNetwork_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=solanaNetworkSlug]/solana/observations/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.SolanaNetwork_Timestamp, data.selector, {
				sources: [data.selector.source],
				fields: {
					absoluteSlot: true,
					blockHeight: true,
					health: true,
					epoch: true,
					slotIndex: true,
					slotsInEpoch: true,
					transactionCount: true,
					currentValidatorCount: true,
					delinquentValidatorCount: true,
					totalActivatedStakeLamports: true,
					solanaCoreVersion: true,
					featureSet: true,
				},
			})
		}
	/>
</Page>
