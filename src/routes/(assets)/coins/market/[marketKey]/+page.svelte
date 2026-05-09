<script lang="ts">
	// Types/constants
	import { parse } from 'devalue'

	import { isMarketEntityId } from '$/lib/isMarketEntityId.ts'


	// Context
	import { resolve } from '$app/paths'


	// State
	let {
		params,
	} = $props()


	// (Derived)
	const route = $derived.by(() => {
		const raw = params.marketKey ?? ''
		if (raw.length === 0) {
			return {
				marketId: null,
				error: 'Missing market id' as const,
			}
		}
		try {
			const id = parse(decodeURIComponent(raw))
			if (isMarketEntityId(id)) {
				return { marketId: id, error: null }
			}
		} catch {
			// fall through
		}
		return {
			marketId: null,
			error: 'Invalid or unsupported market id' as const,
		}
	})


	// Components
	import Page from '$/components/Page.svelte'
	import MarketView from '$/views/MarketView.svelte'
</script>


<svelte:head>
	<title>
		{route.marketId != null ? `Market` : 'Market · not found'}
	</title>
</svelte:head>


<Page>
	{#if route.error != null || route.marketId == null}
		<h1>
			Not found
		</h1>
		<p>
			{route.error}
		</p>
	{:else}
		<MarketView
			entityId={route.marketId}
			href={(
				resolve(
					'/(assets)/coins/market/[marketKey]',
					{ marketKey: params.marketKey },
				)
			)}
		/>
	{/if}
</Page>
