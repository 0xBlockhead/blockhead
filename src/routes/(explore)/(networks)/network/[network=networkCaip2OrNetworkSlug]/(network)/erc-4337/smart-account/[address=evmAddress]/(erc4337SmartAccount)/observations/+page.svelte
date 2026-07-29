<!-- Generated from APP.ts. Do not edit by hand. -->

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
	import Erc4337SmartAccount_TimestampsView from '$/views/Erc4337SmartAccount_TimestampsView.svelte'
</script>


<svelte:head>
	<title>Smart account observations • Blockhead</title>
</svelte:head>


<Page>
	{@const collectionSelection = select(EntityType.Erc4337SmartAccount, data.selector).$$timestamps}

	<Erc4337SmartAccount_TimestampsView
		href={
			resolve(
				'/(explore)/(networks)/network/[network=networkCaip2OrNetworkSlug]/(network)/erc-4337/smart-account/[address=evmAddress]/(erc4337SmartAccount)/observations',
				{
					network: params.network,
					address: params.address,
				}
			)
		}
		title='Smart account observations'
		selection={collectionSelection}
		countResource={collectionSelection.count}
		id='timestamps'
		data-column-item="flexible"
		data-card
		data-scroll-container
	/>
</Page>
