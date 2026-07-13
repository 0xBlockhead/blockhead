<!-- Generated from APP.ts. Do not edit by hand. -->

<script lang="ts">
	// Types/constants
	import type { PageProps } from './$types.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { ZcashShieldedPoolKind } from '$/schema/ZcashShieldedPool.ts'


	// Context
	import { resolve } from '$app/paths'
	import { select } from '$/routes/+layout.svelte'


	// State
	let {
		data,
		params,
	}: PageProps = $props()

	const pageSelection = $derived(select(EntityType.ZcashShieldedPool, data.selector, {
		fields: {
			noteProtocol: true,
			activationNetworkUpgrade: true,
		},
	}))
	const pageEntityTitle = $derived((data.title ?? (pageSelection.entity == null ? [String((pageSelection.entitySelector.pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool' : [String((({ ...pageSelection.entitySelector, ...pageSelection.entity }).pool) ?? '')].filter(Boolean).join(' ') || 'Zcash shielded pool')))


	// Components
	import Page from '$/components/Page.svelte'
	import ZcashShieldedPoolView from '$/views/ZcashShieldedPoolView.svelte'
</script>


<svelte:head>
	<title>{pageEntityTitle} • Zcash shielded pool • Blockhead</title>
</svelte:head>


<Page>
	<ZcashShieldedPoolView
		href={
			resolve('/network/[network=networkCaip2OrNetworkSlug]/shielded-pool/[pool=stringSegment]', {
				network: params.network,
				pool: params.pool,
			})
		}
		selection={pageSelection}
	/>
</Page>
