<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import CoinsView from '$/views/CoinsView.svelte'
	import GlobalView from '$/views/GlobalView.svelte'
	import LiquidityPoolsView from '$/views/LiquidityPoolsView.svelte'
</script>


<Page>
	<GlobalView
		entityId={{}}
		title="Assets"
		href={resolve('/assets')}
	>
		{#snippet children()}
			<section>
				<CoinsView
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: {},
						fieldName: '$$coins',
					}}
					href={resolve('/coins')}
					id="assets-coins"
					open={false}
				/>
			</section>

			<section>
				<LiquidityPoolsView
					entityFieldReference={{
						entityType: EntityType._Global,
						entityId: {},
						fieldName: '$$liquidityPools',
					}}
					href={resolve('/pools')}
					id="assets-pools"
					open={false}
				/>
			</section>
		{/snippet}
	</GlobalView>
</Page>
