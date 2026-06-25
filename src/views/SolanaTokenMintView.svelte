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
		'$network',
		'mintAddress',
		{
			label: 'latest mint snapshot',
		},
	],
	content: {
		dl: [
			[
				'$network',
				'mintAddress',
				'$$tokenAccounts',
			],
			[
				{
					label: 'latest supply/decimals snapshot',
				},
				{
					label: 'latest mint authority',
				},
				{
					label: 'latest freeze authority',
				},
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Mint observations',
				items: [
					{
						label: 'slot/source mint-account observations',
					},
				],
			},
			{
				label: 'Token accounts',
				items: [
					{
						label: 'token accounts for bounded source facets',
					},
				],
			},
			{
				label: 'Authorities',
				items: [
					{
						label: 'mint authority',
					},
					{
						label: 'freeze authority from latest observation',
					},
				],
			},
			{
				label: 'Network',
				items: [
					{
						label: 'parent Solana network',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'Metaplex/DAS metadata row when source-backed',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'getAccountInfo jsonParsed mint account',
					},
				],
			},
		],
	},
	lists: [
		{
			id: 'token-accounts',
			label: 'token accounts',
			field: '$$tokenAccounts',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
		{
			id: 'timestamps',
			label: 'timestamps',
			field: '$$timestamps',
			limit: 24,
			item: 'summary',
			collapsible: true,
			emptyText: 'No rows',
		},
	],
} satisfies ComponentProps<typeof EntityView2>['view']

	let {
		selection,
		open = $bindable(true),
		...EntityViewProps
	}: WithRest<
		{
			selection: EntityProxyResource<typeof schema, EntityType.SolanaTokenMint>
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
	entityType={EntityType.SolanaTokenMint}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
