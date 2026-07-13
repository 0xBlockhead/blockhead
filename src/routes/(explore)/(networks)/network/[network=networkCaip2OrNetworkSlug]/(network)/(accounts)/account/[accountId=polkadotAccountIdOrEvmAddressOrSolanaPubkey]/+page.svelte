<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'


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
	import { entityViewComponentByType } from '$/views/index.ts'
</script>


<Page>
	{@const EntityView = entityViewComponentByType[data.selectorMapping.entityType]}

	<EntityView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/account/[accountId=polkadotAccountIdOrEvmAddressOrSolanaPubkey]', {
				network: params.network,
				accountId: params.accountId,
			})
		}
		selection={select(data.selectorMapping.entityType, data.selectorMapping.selector)}
	/>
</Page>
