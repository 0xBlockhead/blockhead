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
	import NetworkView from '$/views/NetworkView.svelte'
</script>


<Page>
	<NetworkView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]', {
				networkSlug: params.networkSlug,
			})
		}
		selection={
			select(EntityType.Network, {
				slug: params.networkSlug,
			}, {
				sources: [
					Source.Constants_Internal,
				],
				fields: {
					$icon: true,
					name: true,
					namespace: true,
					ledgerModels: true,
					executionModels: true,
					$networkStack: true,
					environment: true,
					consensusProtocol: true,
					registryStatus: true,
					shortName: true,
					peeringId: true,
					slip44: true,
					chainId: true,
					$settlementNetwork: true,
				},
			})
		}
	/>
</Page>
