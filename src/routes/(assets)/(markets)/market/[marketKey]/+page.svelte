<script lang="ts">
	// Types/constants
	import { type as arktype } from 'arktype'
	import { parse } from 'devalue'

	import { parseEntitySelector } from '$/schema/$schema.ts'
	import MarketSchema from '$/schema/Market.ts'
	import { schema } from '$/schema/index.ts'


	// State
	let {
		params,
	} = $props()

	const route = $derived.by(() => {
		const raw = params.marketKey ?? ''
		if (raw.length === 0)
			return {
				marketId: null,
				error: 'Missing market id' as const,
			}

		try {
			const marketId = parseEntitySelector(
				schema,
				MarketSchema,
				parse(decodeURIComponent(raw)),
			)
			if (!(marketId instanceof arktype.errors))
				return { marketId, error: null }
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
			selector={route.marketId}
		/>
	{/if}
</Page>
