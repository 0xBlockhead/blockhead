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
	import PolkadotAccount_TimestampView from '$/views/PolkadotAccount_TimestampView.svelte'
</script>


<Page>
	<PolkadotAccount_TimestampView
		href={
			resolve('/(explore)/(networks)/network/[networkSlug=networkSlug]/polkadot/account/[accountId]/observation/[timestampMs=nonNegativeInteger]/[source]', {
				networkSlug: params.networkSlug,
				accountId: params.accountId,
				timestampMs: params.timestampMs,
				source: params.source,
			})
		}
		selection={
			select(EntityType.PolkadotAccount_Timestamp, {
				$account: {
					$network: {
						slug: params.networkSlug,
					},
					accountId: decodeURIComponent(params.accountId),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}, {
				sources: [({
				$account: {
					$network: {
						slug: params.networkSlug,
					},
					accountId: decodeURIComponent(params.accountId),
				},
				timestampMs: Number(params.timestampMs),
				source: decodeURIComponent(params.source),
			}).source],
				fields: {
					freeBalancePlancks: true,
					nonce: true,
				},
			})
		}
	/>
</Page>
