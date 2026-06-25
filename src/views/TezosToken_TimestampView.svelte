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
		'$token',
		'level',
		'source',
	],
	content: {
		dl: [
			[
				'$token',
				'level',
				'source',
				'timestampMs',
				'name',
			],
			[
				'symbol',
				'decimals',
				{
					label: 'metadata/artifact/display/thumbnail URIs',
				},
				'totalSupply',
				'holderCount',
			],
			[
				'transferCount',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Token',
				items: [
					{
						label: 'parent Tezos token',
					},
				],
			},
			{
				label: 'Metadata',
				items: [
					{
						label: 'token metadata fields',
					},
					{
						label: 'URI evidence',
					},
					{
						label: 'TZIP-12/FA2 metadata payload',
					},
				],
			},
			{
				label: 'Supply/counts',
				items: [
					'totalSupply',
					'holderCount',
					'transferCount',
				],
			},
			{
				label: 'Ledger storage',
				items: [
					{
						label: 'big-map key for token_metadata/ledger keys when resolved',
					},
				],
			},
			{
				label: 'Source evidence',
				items: [
					{
						label: 'token metadata/indexer payload',
					},
					{
						label: 'contract storage query',
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
			selection: EntityProxyResource<typeof schema, EntityType.TezosToken_Timestamp>
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
	entityType={EntityType.TezosToken_Timestamp}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
