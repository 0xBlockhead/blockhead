<!-- Generated from APP.ts. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { resolve } from '$app/paths'
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
	import Erc4337Paymaster_TimestampsView from '$/views/Erc4337Paymaster_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Paymaster observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Erc4337Paymaster, data.selector).$$timestamps}

	<Erc4337Paymaster_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/paymaster/[address=evmAddress]/(erc4337Paymaster)/observations',
				{
					network: params.network,
					address: params.address,
				}
			)
		}
		title='Paymaster observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
	/>
</Page>
