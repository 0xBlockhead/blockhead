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
	import ZcashShieldedActionView from '$/views/ZcashShieldedActionView.svelte'
</script>


<Page>
	<ZcashShieldedActionView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/utxo/tx/[txId]/shielded-action/[pool]/[actionKind]/[actionIndex=nonNegativeInteger]', {
				networkSlug: params.networkSlug,
				txId: params.txId,
				pool: params.pool,
				actionKind: params.actionKind,
				actionIndex: params.actionIndex,
			})
		}
		selection={
			select(EntityType.ZcashShieldedAction, data.selector, {
				fields: {
					nullifier: true,
					noteCommitment: true,
					$pool: true,
					valueCommitment: true,
				},
			})
		}
	/>
</Page>
