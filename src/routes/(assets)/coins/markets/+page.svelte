<script lang="ts">
	// Context
	import { resolve } from '$app/paths'

	import { EntityType } from '$/schema/$EntityType.ts'


	// Components
	import Page from '$/components/Page.svelte'
	import MarketsView from '$/views/MarketsView.svelte'
</script>


<Page>
	<MarketsView
		entityFieldReference={{
			entityType: EntityType._Global,
			entityId: {},
			fieldName: '$$markets',
		}}
		href={resolve('/coins/markets')}
		id="coin-markets-page"
		title="All markets"
	/>
</Page>
