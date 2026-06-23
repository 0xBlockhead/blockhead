<script lang="ts">
	// Types/constants
	import type { ComponentProps } from 'svelte'
	import type { EntityProxyResource } from '$/client/$proxy.svelte.ts'
	import type { WithRest } from '$/typescript/WithRest.ts'
	import { EntityType } from '$/schema/EntityType.ts'
	import { schema } from '$/schema/index.ts'


	// State
	const view = {
		closed: [
			{
				label: 'account',
			},
			{
				label: 'vault',
			},
			{
				label: 'observed time',
			},
		],
		content: {
			dl: [
				[
					{
						label: 'account',
					},
					{
						label: 'vault',
					},
					{
						label: 'observed time',
					},
					'source',
					'equity',
					{
						label: 'PnL',
					},
					{
						label: 'all-time PnL',
					},
					{
						label: 'days following',
					},
					{
						label: 'entry time',
					},
					{
						label: 'lockup time',
					},
				],
			],
		},
		details: {
			tabs: [
				{
					label: 'Account',
					items: [
						{
							label: 'parent Hyperliquid account',
						},
					],
				},
				{
					label: 'Vault',
					items: [
						{
							label: 'parent Hyperliquid vault',
						},
					],
				},
				{
					label: 'Equity history',
					items: [
						{
							label: 'same account/vault observations',
						},
					],
				},
				{
					label: 'Source evidence',
					items: [
						{
							label: 'userVaultEquities or vaultDetails follower payload',
						},
					],
				},
			],
		},
	} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.HyperliquidVaultEquity_Timestamp>
			open?: boolean
		},
		Pick<
			ComponentProps<typeof EntityView2>,
			| 'layout'
			| 'showTypeAnnotation'
		>
	> = $props()


	// Components
	import EntityView2 from '$/components/EntityView2.svelte'
</script>


<EntityView2
	{selection}
	entityType={EntityType.HyperliquidVaultEquity_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
