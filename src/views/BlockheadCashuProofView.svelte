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
		'walletId',
		'$mint',
		'keysetId',
	],
	content: {
		dl: [
			[
				'walletId',
				'$mint',
				'keysetId',
				'secretHash',
				'amount',
			],
			[
				'unit',
				{
					label: 'latest observed proof state',
				},
				{
					label: 'received time',
				},
				'sourceTokenId',
				'$$timestamps',
			],
		],
	},
	details: {
		tabs: [
			{
				label: 'Latest state',
				items: [
					{
						label: 'BlockheadCashuProof_TimestampView',
					},
				],
			},
			{
				label: 'State history',
				items: [
					{
						label: 'BlockheadCashuProof_TimestampsView',
					},
				],
			},
			{
				label: 'Mint/keyset',
				items: [
					{
						label: 'CashuMintView',
					},
					{
						label: 'CashuKeysetView',
					},
				],
			},
			{
				label: 'Secret material',
				items: [
					{
						label: 'redacted secret/signature/DLEQ fields with reveal controls only in local trusted UI',
					},
				],
			},
			{
				label: 'Source token',
				items: [
					{
						label: 'BlockheadCashuTokenView when imported from a token string',
					},
				],
			},
		],
	},
	lists: [
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
			selection: EntityProxyResource<typeof schema, EntityType.BlockheadCashuProof>
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
	entityType={EntityType.BlockheadCashuProof}
	entitySelector={selection.entitySelector}
	bind:open
	{...EntityViewProps}
	{view}
/>
